import React from "react";
import PokeLogo from "../../assets/pokeball.svg";
import "./PokeLoading.css";

export default function PokeLoading() {
  return (
    <div className="PokeLoading">
      <img id="pokeball" src={PokeLogo} alt="pokeball" />
    </div>
  );
}
