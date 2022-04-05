import React from "react";
import "./PokeSearchBar.css";

export default function PokeSearchBar() {
  return (
    <div className="PokeSearchBar">
      <input
        type="text"
        placeholder="Search your Pokemon!"
        className="search"
      />
      {/* <input type="text" placeholder="Search your Pokemon!" class="search" />
      <input type="text" placeholder="Search your Pokemon!" class="search" /> */}
    </div>
  );
}
