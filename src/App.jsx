import { useState, useEffect } from 'react';
import NewsFilter from './components/NewsFilter';
import NewsList from './components/NewsList';
import './index.css';

// Usamos o rss2json para evitar problemas de CORS e converter o RSS do Record em JSON
const RSS_URL = 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.record.pt%2Frss';

function App() {
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    try {
      const response = await fetch(RSS_URL);
      const data = await response.json();
      
      if (data.status === 'ok') {
        const formattedNews = data.items.map(item => {
          // Extrair a primeira categoria ou definir uma padrão
          const category = item.categories && item.categories.length > 0 
            ? item.categories[0] 
            : 'Geral';

          // Limpar um pouco as tags HTML da descrição para o excerto
          const cleanDescription = item.description.replace(/<[^>]+>/g, '').trim();

          return {
            id: item.guid || item.link,
            title: item.title,
            content: cleanDescription,
            link: item.link,
            imageUrl: item.thumbnail || item.enclosure?.link,
            date: new Date(item.pubDate).toLocaleString('pt-PT', {
              day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
            }),
            category: category
          };
        });

        // Extrair categorias únicas
        const uniqueCategories = [...new Set(formattedNews.map(n => n.category))];
        
        setNews(formattedNews);
        setCategories(uniqueCategories.filter(c => c && c !== 'Geral').slice(0, 8)); // Top 8 categorias
        setLoading(false);
      }
    } catch (error) {
      console.error("Erro ao carregar notícias:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Carregar imediatamente
    fetchNews();

    // Configurar o intervalo para 10 minutos (10 * 60 * 1000 ms)
    const interval = setInterval(() => {
      console.log("A atualizar notícias...");
      fetchNews();
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const filteredNews = selectedCategory === 'Todas' 
    ? news 
    : news.filter(article => article.category === selectedCategory);

  return (
    <div>
      <header className="header">
        <h1>LumarSports</h1>
        <p>As últimas notícias de desporto, atualizadas a cada 10 minutos</p>
      </header>

      <main className="app-main">
        {categories.length > 0 && (
          <NewsFilter 
            categories={categories} 
            selectedCategory={selectedCategory} 
            onSelectCategory={setSelectedCategory} 
          />
        )}
        
        <section className="feed-section">
          <NewsList news={filteredNews} />
        </section>
      </main>
    </div>
  );
}

export default App;
