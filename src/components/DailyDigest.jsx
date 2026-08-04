import React, { useState, useEffect, useRef } from "react";

function DailyDigest({ news }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [digestText, setDigestText] = useState("");
  const [sentences, setSentences] = useState([]);

  // Ref para controlar a fila de áudio
  const isCancelled = useRef(false);
  const currentAudio = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (!news || news.length === 0) {
      setDigestText("Não há notícias suficientes para gerar o resumo do dia.");
      setSentences([]);
      return;
    }

    // Algoritmo: Falar de tudo um pouco
    // Ignorar lixo (notícias de áudio genéricas da RTP/Observador que não têm texto real)
    const validNews = news.filter((n) => {
      const text = (n.title + " " + n.content).toLowerCase();
      return (
        !text.includes("rádio observador") &&
        !text.includes("noticiário antena") &&
        !text.includes("aconteça o que acontecer") &&
        !text.includes("podcast")
      );
    });

    // Algoritmo: Falar de tudo um pouco (Versão Alargada)
    // Escolhemos até 12 notícias Gerais (Mundo, Política, etc) e até 8 de Desporto. (Total: 20 notícias)
    const sportsNews = validNews.filter((n) => n.category === "Desporto");
    const generalNews = validNews.filter((n) => n.category !== "Desporto");

    const selectedNews = [
      ...generalNews.slice(0, 12),
      ...sportsNews.slice(0, 8),
    ].sort((a, b) => b.dateObj - a.dateObj); // Misturar ordenando por data recente

    const textArray = [];
    let fullText =
      "Bem-vindo à LumarNews. Aqui tens o resumo das principais notícias. ";

    selectedNews.forEach((article, index) => {
      let intro = "";
      if (index === 0) intro = "A começar, ";
      else if (
        article.category === "Desporto" &&
        index > 0 &&
        selectedNews[index - 1].category !== "Desporto"
      ) {
        intro = "No mundo do desporto, ";
      } else {
        intro = index % 2 === 0 ? "Além disso, " : "Entretanto, ";
      }

      const sourceTxt = article.source ? `segundo o ${article.source}, ` : "";
      const text = `${intro}${sourceTxt}${article.title}. ${article.content}`;

      textArray.push(text);
      fullText += text + " ";
    });

    fullText +=
      "E este foi o teu resumo informativo da LumarNews. Volta mais tarde para mais atualizações!";

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
      utterance.lang = "pt-PT";

      const voices = window.speechSynthesis.getVoices();
      const ptVoices = voices.filter((v) => v.lang.startsWith("pt"));

      // 1. Tentar encontrar vozes Online/Premium do Google (muito mais humanas e naturais)
      let selectedVoice = ptVoices.find(
        (v) =>
          v.name.toLowerCase().includes("google") ||
          v.name.toLowerCase().includes("natural") ||
          v.name.toLowerCase().includes("premium") ||
          v.name.toLowerCase().includes("online"),
      );

      // 2. Se não houver vozes premium, tentar voz masculina normal
      if (!selectedVoice) {
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
        selectedVoice = ptVoices.find((v) => {
          const nameLower = v.name.toLowerCase();
          return maleVoiceNames.some((maleName) =>
            nameLower.includes(maleName),
          );
        });
      }

      // 3. Fallback absoluto
      if (!selectedVoice) {
        selectedVoice = ptVoices.find((v) => v.lang === "pt-PT") || ptVoices[0];
      }

      if (selectedVoice) utterance.voice = selectedVoice;

      utterance.pitch = 1.0; 
      utterance.rate = 1.05; 

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <div
      className="glass-panel"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "340px",
        padding: "1rem",
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h4 style={{ margin: 0, fontSize: "1.1rem" }}>📻 Rádio Resumo</h4>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--primary)",
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
        >
          {isExpanded ? "Esconder guião" : "Ver guião"}
        </button>
      </div>

      <p
        style={{
          margin: 0,
          fontSize: "0.85rem",
          color: "var(--text-color)",
          opacity: 0.8,
        }}
      >
        Ouve um mix das melhores notícias de desporto e atualidade.
      </p>

      <button
        className="btn"
        onClick={toggleSpeech}
        disabled={isLoadingVoice}
        style={{
          fontSize: "1rem",
          padding: "0.8rem 1rem",
          background: isSpeaking ? "transparent" : "var(--primary)",
          color: isSpeaking ? "var(--primary)" : "#fff",
          border: isSpeaking ? "2px solid var(--primary)" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          width: "100%",
          marginTop: "0.5rem",
        }}
        disabled={!news || news.length === 0}
      >
        {isSpeaking ? (
          <>
            <span style={{ fontSize: "1.2rem" }}>🛑</span> Parar Emissão
          </>
        ) : (
          <>
            <span style={{ fontSize: "1.2rem" }}>🎧</span> Iniciar Rádio
          </>
        )}
      </button>

      {isExpanded && (
        <div
          style={{
            background: "var(--bg-color)",
            padding: "1rem",
            borderRadius: "8px",
            maxHeight: "200px",
            overflowY: "auto",
            fontSize: "0.85rem",
            lineHeight: "1.5",
            marginTop: "0.5rem",
          }}
        >
          {sentences.length > 0 ? (
            sentences.map((sent, i) => (
              <p key={i} style={{ marginBottom: "0.5rem" }}>
                {sent}
              </p>
            ))
          ) : (
            <p>{digestText}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default DailyDigest;
