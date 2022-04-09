import React from 'react';
import './PokeDetails.css';
import { Link } from 'react-router-dom';
import Arrow from '../../assets/right-arrow.svg';
import Close from '../../assets/close.png';

const pokeStatType = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  'special-attack': 'SpA',
  'special-defense': 'SpD',
  speed: 'SPD',
};

const pokemonGifUrl = (name, id) => {
  if (id <= 649) {
    return `https://img.pokemondb.net/sprites/black-white/anim/normal/${name}.gif`;
  }
};

const pokemonSpriteUrl = (name) =>
  `https://img.pokemondb.net/sprites/bank/normal/${name}.png`;

export default function PokeDetails({ pokemon }) {
  return (
    <div className="PokeDetailsPage">
      <div className="PokeDetails">
        <Link to="/" style={{ position: 'absolute', top: '0', right: '0' }}>
          <img src={Close} alt="close" className="close" />
        </Link>

        <div className="PokeDetails-header">
          <img
            className="PokeDetails-image"
            src={pokemon.sprites.other['official-artwork'].front_default}
            alt={pokemon.name}
          />
          {/* Padding the id */}
          <p className="PokeDetails-number">
            #{pokemon.id.toString().padStart(3, '0')}
          </p>
          <p className="PokeDetails-name">{pokemon.name}</p>
          <p className="PokeDetails-genus">{pokemon.species.genera[7].genus}</p>
          <div className="PokeDetails-types">
            {pokemon.types.map((type) => (
              <Link to={`/?type=${type.type.name}`} key={type.type.name}>
                <p className={`PokeDetails-type ${type.type.name}`}>
                  {type.type.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
        <div className="PokeDetails-body">
          <div className="PokeDetails-section">
            <p className="PokeDetails-title">pokédex entry</p>
            <p className="PokeDetails-description">
              {/* Remove \f */}
              {pokemon.species.flavor_text_entries[
                pokemon.id <= 649 ? 1 : 6
              ].flavor_text.replace(/\f/g, ' ')}
            </p>
          </div>
          <div className="PokeDetails-section">
            <p className="PokeDetails-title">abilities</p>
            <div className="PokeDetails-abilities">
              {pokemon.abilities.map((ability) => (
                <p
                  className={`PokeDetails-ability ${ability.ability.name}`}
                  key={ability.ability.name}
                >
                  {ability.ability.name}
                </p>
              ))}
            </div>
          </div>

          <div className="PokeDetails-section">
            <div className="PokeDetails-info">
              <div>
                <p className="PokeDetails-title">height</p>
                <p className="PokeDetails-box">{pokemon.height / 10}m</p>
              </div>

              <div>
                <p className="PokeDetails-title">weight</p>
                <p className="PokeDetails-box">{pokemon.weight / 10}kg</p>
              </div>

              <div>
                <p className="PokeDetails-title">base exp</p>
                <p className="PokeDetails-box">{pokemon.base_experience}</p>
              </div>
            </div>
          </div>

          <div className="PokeDetails-section">
            <p className="PokeDetails-title">Weaknesses</p>
            <div className="PokeDetails-weaknesses">
              {pokemon.weakness.map((type) => (
                <Link to={`/?type=${type.toLowerCase()}`} key={type}>
                  <img
                    src={`https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${type.toLowerCase()}.svg`}
                    className={`PokeDetails-weakness ${type.toLowerCase()} icon`}
                    alt={type}
                  />
                </Link>
              ))}
            </div>
          </div>

          <div className="PokeDetails-section">
            <p className="PokeDetails-title">stats</p>
            <div className="PokeDetails-stats">
              {pokemon.stats.map((stat) => (
                <div className="PokeDetails-stat" key={stat.stat.name}>
                  <p
                    className={
                      pokeStatType[stat.stat.name] +
                      ' ' +
                      'PokeDetails-stat-type'
                    }
                  >
                    {pokeStatType[stat.stat.name]}
                  </p>

                  <p>{stat.base_stat}</p>
                </div>
              ))}
              <div className="PokeDetails-stat TOT-BG">
                <p className={'PokeDetails-stat-type TOT'}>TOT</p>

                <p>
                  {pokemon.stats.reduce((acc, stat) => {
                    return acc + stat.base_stat;
                  }, 0)}
                </p>
              </div>
            </div>
          </div>

          {/* <div className="PokeDetails-section">
          <p className="PokeDetails-title">evolutions</p>
          <p>{pokemon.species.flavor_text_entries[1].flavor_text}</p>
        </div> */}
        </div>

        <div className="PokeDetails-footer">
          <p className="PokeDetails-title">evolution</p>
          <div className="PokeDetails-evolutions">
            {pokemon.evolutionChain.map((evo, i) => (
              <div className="PokeDetails-evolution" key={evo.species_name}>
                <Link to={`/pokemon/${evo.id}`} key={evo.id}>
                  <div>
                    <img
                      src={evo.sprite}
                      alt={evo.species_name}
                      className="PokeDetails-evolution-image"
                    />
                    {/* <p>{evo.species_name}</p>
                    <p>{evo.min_level}</p>
                    <p>{evo.trigger_name}</p>
                    <p>{evo.item ? evo.item.name : ""}</p> */}
                  </div>
                </Link>
                {i !== pokemon.evolutionChain.length - 1 && (
                  <div className="PokeDetails-evolution-trigger">
                    {pokemon.evolutionChain[i + 1].trigger_name ===
                      'level-up' && (
                      <p>
                        {pokemon.evolutionChain[i + 1].min_level != null
                          ? `Lvl ` + pokemon.evolutionChain[i + 1].min_level
                          : '❤️Friendship❤️'}
                      </p>
                    )}
                    {pokemon.evolutionChain[i + 1].trigger_name ===
                      'use-item' && (
                      <div className="PokeDetails-evolution-item">
                        <p>
                          {`${
                            pokemon.evolutionChain[i + 1].item.name != null
                              ? pokemon.evolutionChain[i + 1].item.name
                              : '???'
                          }`}
                        </p>
                        <img
                          src={`https://img.pokemondb.net/sprites/items/${
                            pokemon.evolutionChain[i + 1].item.name
                          }.png`}
                          alt=""
                        />
                      </div>
                    )}

                    {pokemon.evolutionChain[i + 1].trigger_name === 'trade' && (
                      <p>Trade</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="PokeDetails-navigation">
            {/* Prev and next pokemon */}

            {pokemon.prevPokemon && (
              <Link to={`/pokemon/${pokemon.id - 1}`}>
                <div className="PokeDetails-navigation-prev">
                  {/* Arrow left png */}
                  <img
                    src={Arrow}
                    alt="prev-pokemon"
                    className="PokeDetails-navigation-arrow right-arrow"
                  />
                  <img
                    src={
                      pokemonGifUrl(
                        pokemon.prevPokemon.name,
                        pokemon.prevPokemon.id
                      ) || pokemonSpriteUrl(pokemon.prevPokemon.name)
                    }
                    // src={`https://img.pokemondb.net/sprites/black-white/anim/normal/${pokemon.prevPokemon.name}.gif`}
                    alt={pokemon.prevPokemon.name}
                  />
                  <p className="PokeDetails-navigation-pokemon-name">
                    {pokemon.prevPokemon.name}
                  </p>
                  <p>#{pokemon.prevPokemon.id.toString().padStart(3, '0')}</p>
                </div>
              </Link>
            )}

            {pokemon.prevPokemon && pokemon.nextPokemon ? (
              <p className="vertical-line" />
            ) : (
              // <p className="vertical-line" style={{ background: '#fff' }} />

              <p />
            )}

            {pokemon.nextPokemon && (
              <Link to={`/pokemon/${pokemon.id + 1}`}>
                <div className="PokeDetails-navigation-next">
                  <p className="PokeDetails-navigation-pokemon-name">
                    {pokemon.nextPokemon.name}
                  </p>
                  <p>#{pokemon.nextPokemon.id.toString().padStart(3, '0')}</p>
                  <img
                    src={
                      pokemonGifUrl(
                        pokemon.nextPokemon.name,
                        pokemon.nextPokemon.id
                      ) || pokemonSpriteUrl(pokemon.nextPokemon.name)
                    }
                    // src={`https://img.pokemondb.net/sprites/black-white/anim/normal/${pokemon.nextPokemon.name}.gif`}
                    alt={pokemon.nextPokemon.name}
                  />
                  <img
                    src={Arrow}
                    alt="next-pokemon"
                    className="PokeDetails-navigation-arrow left-arrow"
                  />
                </div>
              </Link>
            )}
            {/* 
            <div className="PokeDetails-navigation-next">
              {pokemon.nextPokemon && (
                <Link to={`/pokemon/${pokemon.id + 1}`}>
                  <img
                    src={`https://img.pokemondb.net/sprites/black-white/anim/normal/${pokemon.nextPokemon.name}.gif`}
                    alt={pokemon.nextPokemon.name}
                  />
                </Link>
              )}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
