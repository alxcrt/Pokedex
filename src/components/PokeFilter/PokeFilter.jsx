import React from 'react';
import './PokeFilter.css';

export default function PokeFilter() {
  return (
    <div className="PokeFilter">
      <div className="PokeFilter-sort">
        {/* Create a dropdownmenu Ascendind/Descending */}
        <select>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {/* Cerate 2 input from 10 to 100 */}
      <div className="PokeFilter-range">
        <p>from</p>
        <input type="number" min="1" max="649" />
        <p>to</p>
        <input type="number" min="1" max="649" />
      </div>
    </div>
  );
}
