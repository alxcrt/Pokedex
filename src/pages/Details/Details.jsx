import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PokeDetails from '../../components/PokeDetails';
import PokeLoading from '../../components/PokeLoading';

const axios = require('axios');

export default function Details() {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [isLoading, setIsLoadind] = useState(true);

  const fetchEvolutionChain = async (data) => {
    let evoData = data.chain;
    let evoChain = [];

    do {
      let evoDetails = evoData['evolution_details'][0];
      let pokemonData = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${evoData.species.name}`
      );

      evoChain.push({
        species_name: evoData.species.name,
        min_level: !evoDetails ? 1 : evoDetails.min_level,
        trigger_name: !evoDetails ? null : evoDetails.trigger.name,
        item: !evoDetails ? null : evoDetails.item,
        sprite:
          pokemonData.data.sprites.other['official-artwork'].front_default,
        id: pokemonData.data.id,
      });

      evoData = evoData['evolves_to'][0];
    } while (!!evoData && evoData.hasOwnProperty('evolves_to'));
    return evoChain;
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
      // pokemonData.evolutionChain = ;
      pokemonData.evolutionChain = await fetchEvolutionChain(resp.data);

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
        (p) => p.collectibles_slug === pokemonData.name
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
          {/* <PokeNavBar /> */}
          <PokeDetails pokemon={pokemon} />
        </>
      )}
    </>
  );
}
