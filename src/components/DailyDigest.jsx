import React, { useState, useEffect, useRef } from "react";

function DailyDigest({ news }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingVoice, setIsLoadingVoice] = useState(false);
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

  const toggleSpeech = async () => {
    if (isSpeaking || isLoadingVoice) {
      // Parar
      isCancelled.current = true;
      if (currentAudio.current) {
        currentAudio.current.pause();
        currentAudio.current = null;
      }
      setIsSpeaking(false);
      setIsLoadingVoice(false);
    } else {
      // Iniciar
      isCancelled.current = false;
      setIsSpeaking(true);
      setIsLoadingVoice(true);

      try {
        for (let i = 0; i < sentences.length; i++) {
          if (isCancelled.current) break;

          // Buscar o áudio para esta frase específica à Netlify Function (ElevenLabs)
          const response = await fetch("/.netlify/functions/tts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: sentences[i] }),
          });

          if (!response.ok) {
            console.error("Erro na API de voz:", await response.text());
            throw new Error("Falha ao gerar voz");
          }

          const blob = await response.blob();
          const url = URL.createObjectURL(blob);

          if (isCancelled.current) {
            URL.revokeObjectURL(url);
            break;
          }

          // A primeira frase carregou, já podemos tirar o "Loading"
          if (i === 0) setIsLoadingVoice(false);

          const audio = new Audio(url);
          currentAudio.current = audio;

          // Esperar que o áudio termine antes de avançar para a próxima notícia
          await new Promise((resolve) => {
            audio.onended = resolve;
            audio.onerror = resolve; // Em caso de erro, salta para a próxima
            audio.play();
          });

          URL.revokeObjectURL(url);
        }
      } catch (error) {
        console.error(error);
        alert(
          "Ocorreu um erro ao ligar ao servidor de voz. Verifica a tua ligação.",
        );
      } finally {
        setIsSpeaking(false);
        setIsLoadingVoice(false);
        currentAudio.current = null;
      }
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
        disabled={!news || news.length === 0 || isLoadingVoice}
      >
        {isLoadingVoice ? (
          <>
            <span style={{ fontSize: "1.2rem" }}>⏳</span> A afinar a voz...
          </>
        ) : isSpeaking ? (
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
