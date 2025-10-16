import React from 'react'
import HTMLFlipBook from "react-pageflip";
import pages, { coverBackground, coverBackgroundSrc } from "../data/bookData";

function Book() {

  const pokemonData = pages;
  // Decide cover background precedence: image wins over CSS background
  const coverStyle = coverBackgroundSrc
    ? {
        // add a darker overlay so the cover logo is more visible
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${new URL(`../assets/${coverBackgroundSrc}`, import.meta.url).href})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    : (coverBackground
        ? { background: coverBackground }
        : {});

  return (
    <HTMLFlipBook 
      width={370} 
      height={500}
      maxShadowOpacity={0.5}
      drawShadow={true}
      showCover={true}
      size='fixed'
    >
      <div className="page" style={{ background: 'transparent' }}>
        <div className="page-content cover" style={coverStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <div style={{ background: 'rgba(0,0,0,0.28)', padding: 14, borderRadius: 12, boxShadow: '0 12px 30px rgba(0,0,0,0.55)' }}>
              <img
                src={new URL("../assets/BandariyaNOBG.png", import.meta.url).href}
                alt="Bandariya"
                className="pokemon-logo"
                style={{ display: 'block', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.6))', maxWidth: '220px' }}
              />
            </div>
          </div>
        </div>
      </div>

      {pokemonData.map((pokemon) => {
        const bgImage = pokemon.backgroundSrc
          ? new URL(`../assets/${pokemon.backgroundSrc}`, import.meta.url).href
          : null;
        // Dim the background by layering a stronger semi-transparent black gradient on top of the image
        const pageContentStyle = bgImage
          ? {
              backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }
          : (pokemon.background ? { background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), ${pokemon.background}` } : {});

        return (
          <div className="page" key={pokemon.id} style={{ background: 'transparent' }}>
            <div className="page-content" style={pageContentStyle}>
            <div className="pokemon-container">
              <img src={pokemon.image} alt={pokemon.name} loading="lazy" decoding="async" />
              <div className="pokemon-info">
                <h2 className="pokemon-name" style={{ color: '#fff' }}>{pokemon.name}</h2>
                <p className="pokemon-number" style={{ color: '#fff' }}>#{pokemon.id}</p>
                <div>
                  {pokemon.types.map((type) => (
                    <span key={type} className={`pokemon-type type-${type.toLowerCase()}`} style={{ color: '#fff' }}>
                      {type}
                    </span>
                  ))}
                </div>
                <p className="pokemon-description" style={{ color: '#fff' }}>{pokemon.description}</p>
              </div>
            </div>
            </div>
          </div>
        );
      })}
    </HTMLFlipBook>
  );
}

export default Book