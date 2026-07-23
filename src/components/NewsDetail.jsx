import React from 'react';
import { getFallbackImage } from '../utils';

function NewsDetail({ article, onBack }) {
  if (!article) return null;

  return (
    <div className="news-detail-container">
      <button className="back-btn" onClick={onBack}>
        &larr; Voltar às notícias
      </button>

      <article className="news-detail-card">
        <img 
          src={article.imageUrl || getFallbackImage(article.category)} 
          alt={article.title} 
          className="news-detail-img" 
        />
        
        <div className="news-detail-content">
          <div className="news-detail-header">
            <span className="news-detail-date">{article.date} &bull; {article.source}</span>
            {article.category && <span className="news-detail-category">{article.category}</span>}
          </div>
          
          <h1 className="news-detail-title">{article.title}</h1>
          
          <div className="news-detail-body">
            <p>{article.content}</p>
          </div>

          <div className="news-detail-footer">
            <div className="copyright-notice">
              Fonte original: {article.source} - Direitos reservados
            </div>
            
            <div className="action-buttons" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: article.title,
                      text: `Lê esta notícia: ${article.title}`,
                      url: article.link,
                    }).catch(console.error);
                  } else {
                    navigator.clipboard.writeText(article.link);
                    alert("Link copiado para a área de transferência!");
                  }
                }}
                className="btn btn-outline share-btn"
                style={{ width: 'auto' }}
              >
                Partilhar
              </button>
              <a 
                href={article.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn external-link-btn"
              >
                Ler resto no site original
              </a>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

export default NewsDetail;
