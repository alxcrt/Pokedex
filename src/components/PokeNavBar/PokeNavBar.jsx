import React from 'react';
import { Link } from 'react-router-dom';
import './PokeNavBar.css';

export default function PokeNavBar() {
  return (
    <div className="PokeNavBar">
      <Link to="/">
        <p>Home</p>
      </Link>
    </div>
  );
}
