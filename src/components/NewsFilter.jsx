import { useState } from "react";

function NewsFilter({
  sources,
  selectedSource,
  onSelectSource,
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="filters-wrapper">
      <div className="filters-header">
        <button
          className="filters-toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "Esconder Filtros ▴" : "Mostrar Filtros ▾"}
        </button>
      </div>

      {isOpen && (
        <div className="filters-content">
          <div className="filter-group">
            <span className="filter-label">Pesquisar:</span>
            <div className="filter-container">
              <input
                type="text"
                placeholder="Ex: Benfica, Governo, Desporto..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="filter-group">
            <span className="filter-label">Fonte:</span>
            <div className="filter-container">
              <button
                className={`filter-btn ${selectedSource === "Todas" ? "active" : ""}`}
                onClick={() => onSelectSource("Todas")}
              >
                Todas
              </button>
              {sources.map((source) => (
                <button
                  key={source}
                  className={`filter-btn ${selectedSource === source ? "active" : ""}`}
                  onClick={() => onSelectSource(source)}
                >
                  {source}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <span className="filter-label">Tema:</span>
            <div className="filter-container">
              <button
                className={`filter-btn ${selectedCategory === "Todas" ? "active" : ""}`}
                onClick={() => onSelectCategory("Todas")}
              >
                Todas
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  className={`filter-btn ${selectedCategory === category ? "active" : ""}`}
                  onClick={() => onSelectCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewsFilter;
