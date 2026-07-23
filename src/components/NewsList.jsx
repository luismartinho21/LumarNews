import React from 'react';
import { getFallbackImage } from '../utils';

function NewsList({ news, onArticleClick, isLoading }) {
  if (isLoading && (!news || news.length === 0)) {
    return (
      <div className="news-feed">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="news-card skeleton-card">
            <div className="skeleton-img"></div>
            <div className="news-card-content">
              <div className="skeleton-text skeleton-title"></div>
              <div className="skeleton-text skeleton-body"></div>
              <div className="skeleton-text skeleton-body short"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!news || news.length === 0) {
    return (
      <div className="empty-state">
        <h3>Nenhuma notícia encontrada</h3>
        <p>Tenta ajustar os filtros ou a tua pesquisa.</p>
      </div>
    );
  }

  return (
    <div className="news-feed">
      {news.map((article) => (
        <a 
          key={article.id}
          href="#"
          className="news-card"
          onClick={(e) => {
            e.preventDefault();
            onArticleClick(article);
          }}
          role="button"
          tabIndex={0}
        >
          <img 
            src={article.imageUrl || getFallbackImage(article.category)} 
            alt={article.title} 
            className="news-card-img" 
          />
          <div className="news-card-content">
            <div className="news-card-header">
              <span className="news-card-date">{article.date} &bull; {article.source}</span>
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
