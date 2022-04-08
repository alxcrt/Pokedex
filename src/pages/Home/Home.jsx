import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PokeCard from '../../components/PokeCard';
import './Home.css';
import usePokedex from '../../stores/usePokedex';
import PokeLoading from '../../components/PokeLoading';
import PokeSearchBar from '../../components/PokeSearchBar';
import { useLocation } from 'react-router-dom';
import Close from '../../assets/close.png';
import { useNavigate } from 'react-router-dom';

// import PokeNavBar from '../../components/PokeNavBar';

const axios = require('axios');

const pokemonsOnPage = 25;
const MAX_POKEMON_ID = 649;

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

  // const filterPokedex = useCallback(
  //   (pokedex) => {
  //     const filteredPokedex = pokedex.filter((pokemon) => {
  //       // const { name, id } = pokemon;
  //       if (params.get('type')) {
  //         const type = params.get('type');
  //         return pokemon.types.some((t) => t.type.name === type);
  //       }
  //       return true;
  //     });
  //     setFilteredPokedex(filteredPokedex);
  //   },
  //   [params]
  // );

  const fetchFilteredPokemonData = useCallback(async () => {
    const promiseArr = [];
    const resp = await axios.get(
      `https://pokeapi.co/api/v2/type/${params.get('type')}`
    );
    const pokemonData = resp.data.pokemon.map((p) => p.pokemon);
    // console.log(pokemonData);
    const pokemonIds = pokemonData.map((p) => p.url.split('/')[6]);
    // console.log(pokemonIds);
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
    // console.log(pokemonNames);
  }, [fecthPokemonNames]);

  useEffect(() => {
    // console.log(params.get('type'));
    pokedex.length = 0;
    setLoading(true);
    // console.log(pokedex);
    if (!params.get('type')) {
      // console.log('fetching data');
      // setLoading(true);
      const fetchData = async () => {
        const resp = await fetchPokemonData();
        // console.log(resp);
        setPokedex(resp);
        setFilteredPokedex(resp);
        // setFilteredPokemon(resp);
        // setLoading(false);
        setLoading(false);
      };
      fetchData();
    } else if (params.get('type')) {
      // console.log('fetching filtered data');
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

    // filterPokedex(pokedex);
  }, [params, fetchFilteredPokemonData]);

  const handleSearch = async (searchTerm) => {
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
      // Search by name,id, type
      const filteredPokes = pokedex.filter((pokemon) => {
        // for (const type of pokemon.types) {
        if (
          pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
          // type.type.name.toLowerCase() === pokemonType
          // pokemon.id.toString().includes(searchTerm) ||
          // type.type.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return true;
          // }
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
      // console.log('bottom of the page');
      const fetchData = async () => {
        const resp = await fetchPokemonData();
        setPokedex([...pokedex, ...resp]);
        setFilteredPokedex([...filteredPokedex, ...resp]);
      };
      fetchData();
    }
  };

  // const loadMorePokemons = () => {
  //   const fetchData = async () => {
  //     const resp = await fetchPokemonData();
  //     setPokedex([...pokedex, ...resp]);
  //     setFilteredPokedex([...filteredPokedex, ...resp]);
  //   };
  //   fetchData();
  // };

  // const filterByType = (type) => {
  //   const filteredPokes = pokedex.filter((pokemon) => {
  //     for (const pokemonType of pokemon.types) {
  //       if (pokemonType.type.name === type) {
  //         return true;
  //       }
  //     }
  //     return false;
  //   });
  //   setFilteredPokedex(filteredPokes);
  // };

  return (
    <>
      {/* <h1>Home</h1> */}

      {loading ? (
        <PokeLoading />
      ) : (
        <div className="Home">
          {/* <PokeNavBar /> */}
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
