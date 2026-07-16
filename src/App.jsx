import { useState, useEffect } from 'react';
import NewsForm from './components/NewsForm';
import NewsList from './components/NewsList';
import './index.css'; // Make sure this is imported!

function App() {
  const [news, setNews] = useState(() => {
    // Load from local storage on initial render
    const saved = localStorage.getItem('lumar_sports_news');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Save to local storage whenever news changes
  useEffect(() => {
    localStorage.setItem('lumar_sports_news', JSON.stringify(news));
  }, [news]);

  const handleAddNews = (newArticle) => {
    setNews([newArticle, ...news]);
  };

  const handleDeleteNews = (id) => {
    setNews(news.filter(article => article.id !== id));
  };

  return (
    <div>
      <header className="header">
        <h1>LumarSports</h1>
        <p>A principal fonte de notícias de futebol</p>
      </header>

      <main className="app-grid">
        <section className="form-section">
          <NewsForm onAddNews={handleAddNews} />
        </section>
        
        <section className="feed-section">
          <NewsList news={news} onDeleteNews={handleDeleteNews} />
        </section>
      </main>
    </div>
  );
}

export default App;
