import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PokeCard from '../../components/PokeCard';
import './Home.css';
import usePokedex from '../../stores/usePokedex';
import PokeLoading from '../../components/PokeLoading';
import PokeSearchBar from '../../components/PokeSearchBar';
import { useLocation, Link } from 'react-router-dom';
import Close from '../../assets/close.png';
import { useNavigate } from 'react-router-dom';
import Pokedex from '../../assets/Pokedex.png';

const axios = require('axios');

const pokemonsOnPage = 24;
const MAX_POKEMON_ID = 898;

export default function Home() {
  const { pokedex, setPokedex } = usePokedex();
  const [filteredPokedex, setFilteredPokedex] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pokemonNames, setPokemonNames] = useState([]);
  const search = useLocation().search;
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const navigate = useNavigate();
  // Get query params

  const fecthPokemonNames = useCallback(async () => {
    const resp = await axios.get(
      `https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON_ID}&offset=0`
    );
    const pokeNames = resp.data.results.map((pokemon) => pokemon.name);
    setPokemonNames(pokeNames);
  }, []);

  const fetchFilteredPokemonData = useCallback(async () => {
    const promiseArr = [];
    const resp = await axios.get(
      `https://pokeapi.co/api/v2/type/${params.get('type')}`
    );
    const pokemonData = resp.data.pokemon.map((p) => p.pokemon);
    const pokemonIds = pokemonData.map((p) => p.url.split('/')[6]);
    for (let i = 0; i < pokemonIds.length; i++) {
      if (pokemonIds[i] <= MAX_POKEMON_ID) {
        promiseArr.push(
          axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonIds[i]}`)
        );
      }
    }
    const pokemon = await Promise.all(promiseArr);
    return pokemon.map((p) => p.data);
  }, [params]);

  const fetchPokemonData = useCallback(async () => {
    const promiseArr = [];
    for (
      let i = pokedex.length + 1;
      i <= pokedex.length + pokemonsOnPage;
      i++
    ) {
      promiseArr.push(axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`));
    }
    const resolvedData = await Promise.all(promiseArr);
    return resolvedData.map((data) => data.data);
  }, [pokedex]);

  useEffect(() => {
    fecthPokemonNames();
  }, [fecthPokemonNames]);

  useEffect(() => {
    pokedex.length = 0;
    setLoading(true);
    if (!params.get('type')) {
      const fetchData = async () => {
        const resp = await fetchPokemonData();
        setPokedex(resp);
        setFilteredPokedex(resp);
        setLoading(false);
      };
      fetchData();
    } else if (params.get('type')) {
      const fetchData = async () => {
        const resp = await fetchFilteredPokemonData();
        setPokedex(resp);
        setFilteredPokedex(resp);
        setLoading(false);
      };
      fetchData();
    } else {
      setFilteredPokedex(pokedex);
      setLoading(false);
    }
  }, [params, fetchFilteredPokemonData]);

  const handleSearch = async (searchTerm) => {
    console.log(searchTerm);
    if (searchTerm !== '' && !params.get('type')) {
      const filteredPokemonNames = pokemonNames.filter((pokemon) =>
        pokemon.toLowerCase().startsWith(searchTerm.toLowerCase())
      );

      const filteredPokemon = await Promise.all(
        filteredPokemonNames.map((pokemon) =>
          axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
        )
      );

      setFilteredPokedex(filteredPokemon.map((p) => p.data));
    } else {
      const filteredPokes = pokedex.filter((pokemon) => {
        if (pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          return true;
        }
        return false;
      });

      setFilteredPokedex(filteredPokes);
    }
  };

  window.onscroll = function () {
    if (
      pokedex.length > MAX_POKEMON_ID ||
      filteredPokedex.length !== pokedex.length ||
      params.get('type')
    ) {
      return;
    }

    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      const fetchData = async () => {
        const resp = await fetchPokemonData();
        setPokedex([...pokedex, ...resp]);
        setFilteredPokedex([...filteredPokedex, ...resp]);
      };
      fetchData();
    }
  };

  return (
    <>
      {loading ? (
        <PokeLoading />
      ) : (
        <div className="Home">
          <Link to="/">
            <img src={Pokedex} alt="Pokedex" className="Pokedex-Logo" />
          </Link>

          <PokeSearchBar onSearch={handleSearch} />

          {params.get('type') && (
            <p
              style={{ justifySelf: 'left' }}
              className={`Home-type ${params.get('type')}`}
              // key={type.type.name}
            >
              {params.get('type')}
              <img
                className="close-icon"
                // src="https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/fire.svg"
                src={Close}
                alt="reset"
                onClick={() => {
                  navigate('/');
                }}
              />
            </p>
          )}

          <div className="PokeDex">
            {filteredPokedex.map((pokemon) => (
              <PokeCard key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
