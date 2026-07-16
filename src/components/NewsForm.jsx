import { useState } from 'react';

function NewsForm({ onAddNews }) {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content) return;

    const newArticle = {
      id: Date.now().toString(),
      title,
      subtitle,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000&auto=format&fit=crop',
      content,
      date: new Date().toLocaleDateString('pt-PT', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    };

    onAddNews(newArticle);

    // Reset form
    setTitle('');
    setSubtitle('');
    setImageUrl('');
    setContent('');
  };

  return (
    <div className="glass-panel">
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Criar Notícia</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Título</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Ex: LumarSports Vence o Campeonato!" 
            required
          />
        </div>
        <div className="form-group">
          <label>Subtítulo</label>
          <input 
            type="text" 
            value={subtitle} 
            onChange={(e) => setSubtitle(e.target.value)} 
            placeholder="Um breve resumo da notícia..." 
          />
        </div>
        <div className="form-group">
          <label>URL da Imagem (Opcional)</label>
          <input 
            type="url" 
            value={imageUrl} 
            onChange={(e) => setImageUrl(e.target.value)} 
            placeholder="https://exemplo.com/imagem.jpg" 
          />
        </div>
        <div className="form-group">
          <label>Conteúdo</label>
          <textarea 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            placeholder="Escreva a notícia completa aqui..."
            required
          />
        </div>
        <button type="submit" className="btn">Publicar Notícia</button>
      </form>
    </div>
  );
}

export default NewsForm;
