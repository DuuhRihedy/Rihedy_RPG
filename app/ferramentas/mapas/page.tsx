"use client";

import { useState } from "react";
import "../ferramentas.css";

const GENERATORS = [
  {
    id: "azgaar",
    label: "Mapa de Mundo",
    icon: "🌍",
    description: "Gera mapas de mundo completos com terreno, biomas, rios, culturas e estados",
    url: "https://azgaar.github.io/Fantasy-Map-Generator/",
    license: "MIT",
    author: "Azgaar",
  },
  {
    id: "city",
    label: "Mapa de Cidade",
    icon: "🏰",
    description: "Gera mapas de cidade procedurais com ruas, quadras e distritos",
    url: "https://maps.probabletrain.com",
    license: "LGPL-3.0",
    author: "ProbableTrain",
  },
];

export default function MapGeneratorsPage() {
  const [activeGenerator, setActiveGenerator] = useState(GENERATORS[0].id);
  const [isLoading, setIsLoading] = useState(true);

  const current = GENERATORS.find((g) => g.id === activeGenerator)!;

  return (
    <div>
      <div className="hero">
        <h1>🗺️ Geradores de Mapas</h1>
        <p>Gere mapas procedurais para suas campanhas — mundos, cidades e mais</p>
      </div>

      {/* Abas dos geradores */}
      <div className="map-tabs">
        {GENERATORS.map((gen) => (
          <button
            key={gen.id}
            className={`map-tab ${activeGenerator === gen.id ? "active" : ""}`}
            onClick={() => {
              setActiveGenerator(gen.id);
              setIsLoading(true);
            }}
          >
            <span className="map-tab-icon">{gen.icon}</span>
            <span className="map-tab-label">{gen.label}</span>
          </button>
        ))}
      </div>

      {/* Info do gerador ativo */}
      <div className="map-info-bar">
        <div className="map-info-text">
          <strong>{current.icon} {current.label}</strong>
          <span className="map-info-desc">{current.description}</span>
        </div>
        <div className="map-info-meta">
          <span className="map-license-badge">{current.license}</span>
          <span className="map-author">por {current.author}</span>
          <a
            href={current.url}
            target="_blank"
            rel="noopener noreferrer"
            className="map-external-link"
            title="Abrir em nova aba"
          >
            ↗ Abrir externo
          </a>
        </div>
      </div>

      {/* Container do iframe */}
      <div className="map-iframe-container">
        {isLoading && (
          <div className="map-loading">
            <div className="map-loading-spinner" />
            <span>Carregando {current.label}...</span>
          </div>
        )}
        <iframe
          key={current.id}
          src={current.url}
          className="map-iframe"
          title={current.label}
          loading="lazy"
          onLoad={() => setIsLoading(false)}
          allow="fullscreen"
        />
      </div>

      {/* Dicas de uso */}
      <div className="map-tips card">
        <h3 className="map-tips-title">💡 Dicas de Uso</h3>
        {activeGenerator === "azgaar" ? (
          <ul className="map-tips-list">
            <li>Clique em <strong>New Map</strong> para gerar um novo mundo aleatório</li>
            <li>Use a roda do mouse para zoom e arraste para mover</li>
            <li>Clique em qualquer estado/cidade para ver detalhes</li>
            <li>Menu <strong>Tools</strong> tem editores de heightmap, culturas e mais</li>
            <li>Exporte como PNG, SVG ou JSON pelo menu <strong>Save</strong></li>
          </ul>
        ) : (
          <ul className="map-tips-list">
            <li>Clique em <strong>Generate</strong> para criar uma nova cidade</li>
            <li>Ajuste parâmetros como tamanho, densidade e estilo no painel lateral</li>
            <li>Use a roda do mouse para zoom</li>
            <li>Exporte como PNG ou SVG</li>
          </ul>
        )}
      </div>
    </div>
  );
}
