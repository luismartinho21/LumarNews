function NewsList({ news }) {
  if (!news || news.length === 0) {
    return (
      <div className="empty-state">
        <h3>A carregar notícias...</h3>
        <p>A aguardar as últimas novidades do mundo do desporto.</p>
      </div>
    );
  }

  return (
    <div className="news-feed">
      {news.map((article) => (
        <a href={article.link} target="_blank" rel="noopener noreferrer" key={article.id} className="news-card">
          {article.imageUrl && (
            <img src={article.imageUrl} alt={article.title} className="news-card-img" />
          )}
          <div className="news-card-content">
            <div className="news-card-header">
              <span className="news-card-date">{article.date}</span>
              {article.category && <span className="news-card-category">{article.category}</span>}
            </div>
            <h3 className="news-card-title">{article.title}</h3>
            <p className="news-card-body">{article.content}</p>
          </div>
        </a>
      ))}
    </div>
  );
}

export default NewsList;
