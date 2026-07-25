import React, { useState, useEffect } from 'react';

function DailyDigest({ news }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [digestText, setDigestText] = useState('');
  const [sentences, setSentences] = useState([]);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (!news || news.length === 0) {
      setDigestText('Não há notícias suficientes para gerar o resumo do dia.');
      setSentences([]);
      return;
    }

    // Gerar um texto amigável (pegar nas 10 mais recentes para não ficar gigante)
    const topNews = news.slice(0, 10);
    const textArray = [];
    
    let fullText = "Bem-vindo à LumarNews. Aqui tens o resumo das principais notícias do momento. ";
    
    topNews.forEach((article, index) => {
      const intro = index === 0 ? "A começar, " : (index % 2 === 0 ? "Além disso, " : "Entretanto, ");
      const sourceTxt = article.source ? `segundo o ${article.source}, ` : "";
      const text = `${intro}${sourceTxt}${article.title}. ${article.content}`;
      
      textArray.push(text);
      fullText += text + " ";
    });

    fullText += "E este foi o teu resumo informativo da LumarNews. Volta mais tarde para mais atualizações!";
    
    setDigestText(fullText);
    setSentences(textArray);
  }, [news]);

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(digestText);
      utterance.lang = 'pt-PT';
      
      const voices = window.speechSynthesis.getVoices();
      const maleVoiceNames = ['cristiano', 'tiago', 'helder', 'daniel', 'antonio', 'antónio', 'ricardo', 'male'];
      const ptVoices = voices.filter(v => v.lang.startsWith('pt'));
      
      let selectedVoice = ptVoices.find(v => {
        const nameLower = v.name.toLowerCase();
        return maleVoiceNames.some(maleName => nameLower.includes(maleName));
      });
      
      if (!selectedVoice) {
        selectedVoice = ptVoices.find(v => v.lang === 'pt-PT') || ptVoices[0];
      }
      
      if (selectedVoice) utterance.voice = selectedVoice;
      
      utterance.pitch = 0.9; 
      utterance.rate = 1.0; 

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <div className="daily-digest-container glass-panel" style={{ padding: '2rem', marginTop: '1rem', borderRadius: '12px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Resumo Rápido 📻</h2>
      
      <p style={{ textAlign: 'center', color: 'var(--text-color)', opacity: 0.8, marginBottom: '2rem' }}>
        Estás com pressa? Ouve as principais notícias do momento enquanto fazes outras coisas.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <button 
          className="btn" 
          onClick={toggleSpeech}
          style={{ 
            fontSize: '1.2rem', 
            padding: '1rem 2rem',
            background: isSpeaking ? 'transparent' : 'var(--primary)',
            color: isSpeaking ? 'var(--primary)' : '#fff',
            border: isSpeaking ? '2px solid var(--primary)' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          disabled={!news || news.length === 0}
        >
          {isSpeaking ? (
             <><span style={{ fontSize: '1.5rem' }}>🛑</span> Parar Emissão</>
          ) : (
             <><span style={{ fontSize: '1.5rem' }}>🎧</span> Iniciar Rádio LumarNews</>
          )}
        </button>
      </div>

      <div className="digest-text" style={{ background: 'var(--bg-color)', padding: '1.5rem', borderRadius: '8px', lineHeight: '1.8' }}>
        <h4 style={{ marginBottom: '1rem' }}>O que vais ouvir:</h4>
        {sentences.length > 0 ? (
          sentences.map((sent, i) => (
            <p key={i} style={{ marginBottom: '0.8rem' }}>{sent}</p>
          ))
        ) : (
          <p>{digestText}</p>
        )}
      </div>
    </div>
  );
}

export default DailyDigest;
