import { useState, useEffect } from 'react';

function CookieBanner({ onReadMore }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('lumar_cookie_consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('lumar_cookie_consent', 'accepted');
    setShow(false);
  };

  const declineCookies = () => {
    localStorage.setItem('lumar_cookie_consent', 'declined');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="cookie-banner glass-panel">
      <div className="cookie-content">
        <h4>Aviso de Cookies e Privacidade</h4>
        <p>
          Utilizamos armazenamento local (LocalStorage) para guardar as suas preferências e otimizar o carregamento das notícias. Ao clicar em "Aceitar", concorda com a nossa{' '}
          <button className="link-btn" onClick={onReadMore}>Política de Privacidade</button>.
        </p>
      </div>
      <div className="cookie-actions">
        <button className="btn btn-outline" onClick={declineCookies}>Recusar</button>
        <button className="btn" onClick={acceptCookies}>Aceitar</button>
      </div>
    </div>
  );
}

export default CookieBanner;
