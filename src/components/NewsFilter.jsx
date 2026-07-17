function NewsFilter({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="filter-container">
      <button 
        className={`filter-btn ${selectedCategory === 'Todas' ? 'active' : ''}`}
        onClick={() => onSelectCategory('Todas')}
      >
        Todas
      </button>
      {categories.map(category => (
        <button 
          key={category}
          className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default NewsFilter;
