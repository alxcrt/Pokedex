import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PokeDetails from '../../components/PokeDetails';
import PokeLoading from '../../components/PokeLoading';

const axios = require('axios');

export default function Details() {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [isLoading, setIsLoadind] = useState(true);

  const getPokemon = async (id) => {
    const data = await axios
      .get(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then((res) => res.data);

    return data;
  };

  const fetchEvolutionChain = async (chain) => {
    let initial = getPokemon(chain?.species?.name);

    const evolutions = [];

    const evos = [initial];

    chain.evolves_to.map((evolution) => {
      let firstEvolution = getPokemon(evolution.species.name).then((res) => {
        res.evolution_details = evolution.evolution_details[0];
        return res;
      });
      evos.push(firstEvolution);

      if (evolution.evolves_to?.length) {
        for (const secondEvolution of evolution.evolves_to) {
          let second = getPokemon(secondEvolution.species.name).then((res) => {
            res.evolution_details = secondEvolution.evolution_details[0];
            return res;
          });
          evos.push(second);
        }
      }
    });

    const resolved = await Promise.all(evos);

    chain.evolves_to.map((evolution) => {
      const initialEvolution = resolved.find(
        (pokemon) => pokemon.name === chain?.species?.name
      );
      const firstEvolution = resolved.find(
        (pokemon) => pokemon.name === evolution.species.name
      );
      const evolutionLine = [initialEvolution, firstEvolution];

      if (evolution.evolves_to.length) {
        for (const secondEvolution of evolution.evolves_to) {
          const second = resolved.find(
            (pokemon) => pokemon.name === secondEvolution.species.name
          );
          evolutions.push([...evolutionLine, second]);
        }
      } else {
        evolutions.push(evolutionLine);
      }
    });

    return evolutions;
  };

  useEffect(() => {
    setIsLoadind(true);
    const fetchData = async () => {
      let pokemonData = {};
      let resp = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
      pokemonData = resp.data;
      resp = await axios.get(pokemonData.species.url);
      pokemonData.species = resp.data;
      resp = await axios.get(pokemonData.species.evolution_chain.url);
      pokemonData.evolutionChain = await fetchEvolutionChain(resp.data.chain);

      // Store the previous pokemon in the pokedex
      await axios
        .get(`https://pokeapi.co/api/v2/pokemon/${pokemonData.id - 1}`)
        .then((resp) => {
          pokemonData.prevPokemon = resp.data;
        })
        .catch(() => {});

      await axios
        .get(`https://pokeapi.co/api/v2/pokemon/${pokemonData.id + 1}`)
        .then((resp) => {
          pokemonData.nextPokemon = resp.data;
        })
        .catch(() => {});

      resp = await axios.get(
        `https://raw.githubusercontent.com/cheeaun/repokemon/master/data/pokemon-list.json`
      );
      const poke = resp.data.find(
        (p) => p.number === pokemonData.id.toString().padStart(3, '0')
      );
      pokemonData.weakness = poke.weakness;

      if (pokemonData.id === 649) {
        pokemonData.nextPokemon = null;
      }

      setPokemon(pokemonData);
      setIsLoadind(false);
    };
    fetchData();
  }, [id]);

  return (
    <>
      {isLoading ? (
        <PokeLoading />
      ) : (
        <>
          <PokeDetails pokemon={pokemon} />
        </>
      )}
    </>
  );
}
