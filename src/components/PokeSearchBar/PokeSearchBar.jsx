import React, { useCallback, useState } from "react";
import "./PokeSearchBar.css";
import { useNavigate } from "react-router-dom";
import PokeReset from "../../assets/restart_icon.png";
import { debounce } from "lodash";

export default function PokeSearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const navigator = useNavigate();

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    onSearchDebounced(event.target.value);
  };

  const onSearchDebounced = useCallback(
    debounce((searchTerm) => {
      onSearch(searchTerm);
    }, 500),
    []
  );

  return (
    <div className="PokeSearchBar">
      <input
        type="text"
        placeholder="Search your Pokemon!"
        className="search"
        value={searchTerm}
        onChange={handleChange}
      />

      {/* <img
        className="reset"
        // src="https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/fire.svg"
        src={PokeReset}
        alt=""
        onClick={() => onResetClick()}
      /> */}
    </div>
  );
}
