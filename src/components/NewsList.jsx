function NewsList({ news, onDeleteNews }) {
  if (!news || news.length === 0) {
    return (
      <div className="empty-state">
        <h3>Ainda não há notícias</h3>
        <p>Preencha o formulário para criar a sua primeira notícia do LumarSports.</p>
      </div>
    );
  }

  return (
    <div className="news-feed">
      {news.map((article) => (
        <article key={article.id} className="news-card">
          <button 
            className="news-card-delete" 
            onClick={() => onDeleteNews(article.id)}
            title="Apagar Notícia"
          >
            ×
          </button>
          <img src={article.imageUrl} alt={article.title} className="news-card-img" />
          <div className="news-card-content">
            <div className="news-card-date">{article.date}</div>
            <h3 className="news-card-title">{article.title}</h3>
            {article.subtitle && <p className="news-card-subtitle">{article.subtitle}</p>}
            <p className="news-card-body">{article.content}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export default NewsList;
