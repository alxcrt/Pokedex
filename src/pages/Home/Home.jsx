import React, { useState, useEffect, useCallback } from "react";
import PokeCard from "../../components/PokeCard";
import "./Home.css";
import usePokedex from "../../stores/usePokedex";
const axios = require("axios");

const pokemonsOnPage = 151;

export default function Home() {
  const { pokedex, setPokedex } = usePokedex();
  const [loading, setLoading] = useState(false);

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
    // console.log(pokedex);
    if (pokedex.length === 0) {
      console.log("fetching data");
      setLoading(true);
      const fetchData = async () => {
        const resp = await fetchPokemonData();
        // console.log(resp);
        setPokedex(resp);
        // setFilteredPokemon(resp);
        setLoading(false);
      };
      fetchData();
    }
  }, []);

  return (
    <div>
      {/* <h1>Home</h1> */}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="PokeDex">
          {pokedex.map((pokemon) => (
            <PokeCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      )}
    </div>
  );
}
