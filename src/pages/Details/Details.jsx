import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const axios = require("axios");

export default function Details() {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [isLoading, setIsLoadind] = useState(true);

  useEffect(() => {
    setIsLoadind(true);
    const fetchData = async () => {
      const resp = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
      setPokemon(resp.data);
      setIsLoadind(false);
    };
    fetchData();
  }, [id]);

  return (
    <div>
      <h1>{id}</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <img
          className="PokeCard-image"
          src={pokemon.sprites.other["official-artwork"].front_default}
          alt={pokemon.name}
        />
      )}
    </div>
  );
}
