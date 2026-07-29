import React, { useState, useEffect } from "react";
import { getFallbackImage } from "../utils";

function NewsList({ news, onArticleClick, isLoading }) {
  const [speakingId, setSpeakingId] = useState(null);

  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  const toggleSpeech = (e, article) => {
    e.preventDefault();
    e.stopPropagation();

    if (speakingId === article.id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
    } else {
      window.speechSynthesis.cancel(); // Para o que estiver a tocar antes

      const textToSpeak = `${article.title}. ${article.content}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = "pt-PT";

      const voices = window.speechSynthesis.getVoices();

      const maleVoiceNames = [
        "cristiano",
        "tiago",
        "helder",
        "daniel",
        "antonio",
        "antónio",
        "ricardo",
        "male",
      ];
      const ptVoices = voices.filter((v) => v.lang.startsWith("pt"));

      let selectedVoice = ptVoices.find((v) => {
        const nameLower = v.name.toLowerCase();
        return maleVoiceNames.some((maleName) => nameLower.includes(maleName));
      });

      if (!selectedVoice) {
        selectedVoice = ptVoices.find((v) => v.lang === "pt-PT") || ptVoices[0];
      }

      if (selectedVoice) utterance.voice = selectedVoice;

      utterance.pitch = 0.9; // Baixar um pouco o tom (pitch) ajuda a parecer mais grave caso o sistema só tenha vozes femininas

      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);

      window.speechSynthesis.speak(utterance);
      setSpeakingId(article.id);
    }
  };
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
              <span className="news-card-date">
                {article.date} &bull; {article.source}
              </span>
              {article.category && (
                <span className="news-card-category">{article.category}</span>
              )}
            </div>
            <h3 className="news-card-title">{article.title}</h3>
            <p className="news-card-body">{article.content}</p>
            <div style={{ marginTop: "0.8rem" }}>
              <button
                onClick={(e) => toggleSpeech(e, article)}
                className="btn btn-outline"
                style={{
                  width: "auto",
                  padding: "0.4rem 0.8rem",
                  fontSize: "0.85rem",
                  background:
                    speakingId === article.id
                      ? "rgba(6, 182, 212, 0.2)"
                      : "transparent",
                  color:
                    speakingId === article.id ? "var(--primary)" : "inherit",
                  borderColor:
                    speakingId === article.id
                      ? "var(--primary)"
                      : "var(--border-color)",
                }}
              >
                {speakingId === article.id
                  ? "🛑 Parar Leitura"
                  : "🎤 Ouvir Resumo"}
              </button>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}

export default NewsList;
