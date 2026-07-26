import { useState, useEffect, useRef } from 'react';
import NewsFilter from './components/NewsFilter';
import NewsList from './components/NewsList';
import NewsDetail from './components/NewsDetail';
import CookieBanner from './components/CookieBanner';
import Footer from './components/Footer';
import LegalPage from './components/LegalPage';
import DailyDigest from './components/DailyDigest';
import './index.css';

const SOURCES = [
  { name: 'Record', url: 'https://www.record.pt/rss' },
  { name: 'A Bola', url: 'https://www.abola.pt/rss' },
  { name: 'O Jogo', url: 'https://www.ojogo.pt/rss' },
  { name: 'SAPO', url: 'https://desporto.sapo.pt/rss' },
  { name: 'RTP', url: 'https://www.rtp.pt/noticias/rss' },
  { name: 'SIC', url: 'https://sicnoticias.pt/rss' },
  { name: 'CNN Portugal', url: 'https://cnnportugal.iol.pt/rss' },
  { name: 'Notícias ao Minuto', url: 'https://www.noticiasaominuto.com/rss/ultima-hora' },
  { name: 'Observador', url: 'https://observador.pt/feed/' },
  { name: 'Público', url: 'https://feeds.feedburner.com/PublicoRSS' }
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
        // Deduplicate saved history just in case it got corrupted
        const unique = [];
        parsed.forEach(item => {
          if (!unique.some(p => p.id === item.id)) unique.push(item);
        });
        return unique.map(item => ({
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
  const [sources, setSources] = useState(['Todas']);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedSource, setSelectedSource] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Navigation State
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [legalPage, setLegalPage] = useState(null); // 'privacy' ou 'terms'
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' ou 'digest'

  // Refresh state
  const [pendingNews, setPendingNews] = useState([]);
  
  // Ref para aceder ao news mais recente no setPendingNews
  const newsRef = useRef(news);
  useEffect(() => {
    newsRef.current = news;
  }, [news]);

  const fetchNews = async (isBackground = false) => {
    try {
      const lastFetch = localStorage.getItem('lumar_last_fetch');
      const now = Date.now();
      
      // Se não for background (ou seja, montagem inicial) e tivermos feito fetch há menos de 5 mins, saltar
      if (!isBackground && lastFetch && (now - parseInt(lastFetch) < 5 * 60 * 1000) && news.length > 0) {
        setIsLoading(false);
        return;
      }

      let fetchedNews = [];
      const timestamp = now;

      for (const source of SOURCES) {
        const noCacheRssUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.url + '?t=' + timestamp)}`;
        const response = await fetch(noCacheRssUrl);
        const data = await response.json();
        
        if (data.status === 'ok') {
          const items = data.items.map(item => {
            let category = item.categories && item.categories.length > 0 
              ? item.categories[0] 
              : 'Geral';
            
            // Forçar categoria Desporto para o fontes desportivas ou temas de desporto
            const sportSources = ['Record', 'A Bola', 'O Jogo', 'SAPO'];
            if (sportSources.includes(source.name) || 
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

      if (fetchedNews.length > 0) {
        if (!isBackground) {
          // Primeira vez ou carregamento inicial forçado
          setNews(prevNews => {
            const reallyNew = fetchedNews.filter(n => !prevNews.some(p => p.id === n.id));
            if (reallyNew.length === 0) return prevNews;
            let combined = [...reallyNew, ...prevNews];
            combined.sort((a, b) => b.dateObj - a.dateObj);
            return combined.slice(0, 150);
          });
        } else {
          // Atualização silenciosa em background
          setPendingNews(prevPending => {
            const currentNews = newsRef.current;
            const reallyNew = fetchedNews.filter(n => 
              !currentNews.some(p => p.id === n.id) && 
              !prevPending.some(p => p.id === n.id)
            );
            if (reallyNew.length === 0) return prevPending;
            let combined = [...reallyNew, ...prevPending];
            combined.sort((a, b) => b.dateObj - a.dateObj);
            return combined;
          });
        }
      }
      
      localStorage.setItem('lumar_last_fetch', now.toString());
    } catch (error) {
      console.error("Erro ao carregar notícias:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem('lumar_news_history', JSON.stringify(news));
    
    // Extrair fontes e categorias únicas
    const uniqueCategories = [...new Set(news.map(n => n.category))];
    setCategories(uniqueCategories.filter(c => c && c !== 'Geral').slice(0, 15));
    
    const uniqueSources = [...new Set(news.map(n => n.source))];
    setSources(uniqueSources.sort());
  }, [news]);

  useEffect(() => {
    fetchNews(false);
    const interval = setInterval(() => {
      fetchNews(true);
    }, 10 * 60 * 1000); // 10 minutes
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

  const applyPendingNews = () => {
    setNews(prevNews => {
      let combined = [...pendingNews, ...prevNews];
      combined.sort((a, b) => b.dateObj - a.dateObj);
      return combined.slice(0, 150);
    });
    setPendingNews([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      <header className="header" onClick={handleBackToHome} style={{cursor: 'pointer'}}>
        <img src="/News_logo.png" alt="LumarNews Logo" className="app-logo" />
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
            <div className="tabs" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', margin: '1rem 0' }}>
              <button 
                className="btn"
                style={{ 
                  background: activeTab === 'feed' ? 'var(--primary)' : 'transparent',
                  color: activeTab === 'feed' ? '#fff' : 'var(--text-color)',
                  border: activeTab === 'feed' ? 'none' : '1px solid var(--border-color)',
                  padding: '0.6rem 1.2rem'
                }}
                onClick={() => { window.speechSynthesis.cancel(); setActiveTab('feed'); }}
              >
                📰 Feed de Notícias
              </button>
              <button 
                className="btn"
                style={{ 
                  background: activeTab === 'digest' ? 'var(--primary)' : 'transparent',
                  color: activeTab === 'digest' ? '#fff' : 'var(--text-color)',
                  border: activeTab === 'digest' ? 'none' : '1px solid var(--border-color)',
                  padding: '0.6rem 1.2rem'
                }}
                onClick={() => { window.speechSynthesis.cancel(); setActiveTab('digest'); }}
              >
                📻 Rádio Resumo
              </button>
            </div>

            {activeTab === 'feed' ? (
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
            ) : (
              <DailyDigest news={filteredNews} />
            )}
          </>
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
      <CookieBanner onReadMore={() => handleNavigate('privacy')} />
      
      {pendingNews.length > 0 && !selectedArticle && !legalPage && (
        <button className="refresh-fab" onClick={applyPendingNews}>
          Nova bomba 💣! ({pendingNews.length}) Atualizar
        </button>
      )}
    </div>
  );
}

export default App;
