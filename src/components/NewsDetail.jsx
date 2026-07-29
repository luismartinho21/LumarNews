import React, { useState, useEffect } from "react";
import { getFallbackImage } from "../utils";

function NewsDetail({ article, onBack }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Para a voz se o utilizador fechar a notícia
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
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

      utterance.pitch = 0.9; // Baixar o pitch

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  if (!article) return null;

  return (
    <div className="news-detail-container">
      <button
        className="back-btn"
        onClick={() => {
          window.speechSynthesis.cancel();
          onBack();
        }}
      >
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
            <span className="news-detail-date">
              {article.date} &bull; {article.source}
            </span>
            {article.category && (
              <span className="news-detail-category">{article.category}</span>
            )}
          </div>

          <h1 className="news-detail-title">{article.title}</h1>

          <div className="news-detail-body">
            <p>{article.content}</p>
          </div>

          <div className="news-detail-footer">
            <div className="copyright-notice">
              Fonte original: {article.source} - Direitos reservados
            </div>

            <div
              className="action-buttons"
              style={{
                display: "flex",
                gap: "1rem",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator
                      .share({
                        title: article.title,
                        text: `Lê esta notícia: ${article.title}`,
                        url: article.link,
                      })
                      .catch(console.error);
                  } else {
                    navigator.clipboard.writeText(article.link);
                    alert("Link copiado para a área de transferência!");
                  }
                }}
                className="btn btn-outline share-btn"
                style={{ width: "auto" }}
              >
                Partilhar
              </button>
              <button
                onClick={toggleSpeech}
                className="btn btn-outline"
                style={{
                  width: "auto",
                  background: isSpeaking
                    ? "rgba(6, 182, 212, 0.2)"
                    : "transparent",
                  color: isSpeaking ? "var(--primary)" : "inherit",
                }}
              >
                {isSpeaking ? "🛑 Parar Leitura" : "🎤 Ouvir Notícia"}
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
