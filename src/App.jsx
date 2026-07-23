import { useState, useEffect } from 'react';
import NewsFilter from './components/NewsFilter';
import NewsList from './components/NewsList';
import NewsDetail from './components/NewsDetail';
import CookieBanner from './components/CookieBanner';
import Footer from './components/Footer';
import LegalPage from './components/LegalPage';
import './index.css';

const SOURCES = [
  { name: 'Record', url: 'https://www.record.pt/rss' },
  { name: 'RTP', url: 'https://www.rtp.pt/noticias/rss' },
  { name: 'CNN Portugal', url: 'https://cnnportugal.iol.pt/rss' }
];

// Função para limpar CDATA e tags indesejadas (incluindo entidades HTML)
const cleanText = (text) => {
  if (!text) return '';
  let cleaned = text
    .replace(/&lt;!\[CDATA\[/gi, '')
    .replace(/\]\]&gt;/gi, '')
    .replace(/<!\[CDATA\[/gi, '')
    .replace(/\]\]>/gi, '');
    
  // Descodificar entidades HTML duplamente (ex: &amp;quot;)
  for (let i = 0; i < 2; i++) {
    cleaned = cleaned
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#8216;/g, "'")
      .replace(/&#8217;/g, "'")
      .replace(/&#8220;/g, '"')
      .replace(/&#8221;/g, '"');
  }
  
  return cleaned.trim();
};

function App() {
  const [news, setNews] = useState(() => {
    const saved = localStorage.getItem('lumar_news_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map(item => ({
          ...item,
          title: cleanText(item.title),
          content: cleanText(item.content),
          category: cleanText(item.category)
        }));
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  
  const [categories, setCategories] = useState([]);
  const [sources, setSources] = useState(['Record', 'RTP', 'CNN Portugal']);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedSource, setSelectedSource] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Navigation State
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [legalPage, setLegalPage] = useState(null); // 'privacy' ou 'terms'

  const fetchNews = async () => {
    try {
      let fetchedNews = [];
      const timestamp = Date.now();

      for (const source of SOURCES) {
        const noCacheRssUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.url + '?t=' + timestamp)}`;
        const response = await fetch(noCacheRssUrl);
        const data = await response.json();
        
        if (data.status === 'ok') {
          const items = data.items.map(item => {
            let category = item.categories && item.categories.length > 0 
              ? item.categories[0] 
              : 'Geral';
            
            // Forçar categoria Desporto para o Record ou temas de desporto
            if (source.name === 'Record' || 
                category.toLowerCase() === 'desporto' || 
                category.toLowerCase() === 'futebol' ||
                category.toLowerCase() === 'modalidades') {
              category = 'Desporto';
            }

            const cleanDescription = item.description.replace(/<[^>]+>/g, '').trim();

            return {
              id: item.guid || item.link,
              title: cleanText(item.title),
              content: cleanText(cleanDescription),
              link: item.link,
              imageUrl: item.thumbnail || item.enclosure?.link,
              dateObj: new Date(item.pubDate), // Guardar para ordenação
              date: new Date(item.pubDate).toLocaleString('pt-PT', {
                day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
              }),
              category: cleanText(category),
              source: source.name
            };
          });
          fetchedNews = [...fetchedNews, ...items];
        }
      }

      setNews(prevNews => {
        const newItems = fetchedNews.filter(n => !prevNews.some(p => p.id === n.id));
        let combined = [...newItems, ...prevNews];
        combined.sort((a, b) => b.dateObj - a.dateObj);
        return combined.slice(0, 100);
      });
    } catch (error) {
      console.error("Erro ao carregar notícias:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem('lumar_news_history', JSON.stringify(news));
    const uniqueCategories = [...new Set(news.map(n => n.category))];
    setCategories(uniqueCategories.filter(c => c && c !== 'Geral').slice(0, 12));
  }, [news]);

  useEffect(() => {
    fetchNews();
    const interval = setInterval(() => {
      fetchNews();
    }, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredNews = news.filter(article => {
    const matchCategory = selectedCategory === 'Todas' || article.category === selectedCategory;
    const matchSource = selectedSource === 'Todas' || article.source === selectedSource;
    const matchSearch = searchQuery.trim() === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      article.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSource && matchSearch;
  });

  const handleNavigate = (page) => {
    setLegalPage(page);
    setSelectedArticle(null);
    window.scrollTo(0, 0);
  };

  const handleBackToHome = () => {
    setLegalPage(null);
    setSelectedArticle(null);
    window.scrollTo(0, 0);
  };

  return (
    <div className="app-container">
      <header className="header" onClick={handleBackToHome} style={{cursor: 'pointer'}}>
        <img src="/logo.png" alt="LumarNews Logo" className="app-logo" />
        <h1 className="visually-hidden">LumarNews</h1>
        <p>O seu portal agregador de notícias gerais e desporto</p>
      </header>

      <main className="app-main">
        {legalPage ? (
          <LegalPage pageType={legalPage} onBack={handleBackToHome} />
        ) : selectedArticle ? (
          <NewsDetail 
            article={selectedArticle} 
            onBack={handleBackToHome} 
          />
        ) : (
          <>
            <NewsFilter 
              sources={sources}
              selectedSource={selectedSource}
              onSelectSource={setSelectedSource}
              categories={categories} 
              selectedCategory={selectedCategory} 
              onSelectCategory={setSelectedCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            
            <section className="feed-section">
              <NewsList news={filteredNews} onArticleClick={setSelectedArticle} isLoading={isLoading} />
            </section>
          </>
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
      <CookieBanner onReadMore={() => handleNavigate('privacy')} />
    </div>
  );
}

export default App;
