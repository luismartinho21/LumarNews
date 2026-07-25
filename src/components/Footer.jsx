function Footer({ onNavigate }) {
  return (
    <footer className="app-footer">
      <div className="footer-links">
        <button onClick={() => onNavigate('privacy')} className="footer-link">Política de Privacidade</button>
        <button onClick={() => onNavigate('terms')} className="footer-link">Termos e Condições</button>
      </div>
      <div className="footer-complaints">
        <a href="https://www.livroreclamacoes.pt/Inicio/" target="_blank" rel="noopener noreferrer">
          <img 
            src="https://www.livroreclamacoes.pt/Entrada/img/logo-livro-reclamacoes.svg" 
            alt="Livro de Reclamações Eletrónico" 
            className="livro-reclamacoes-img"
          />
        </a>
      </div>
      <div className="footer-copyright">
        &copy; {new Date().getFullYear()} LumarNews.<br/>
        Agregador de conteúdos via RSS. Todas as marcas e notícias são propriedade das respetivas entidades emissoras.
      </div>
    </footer>
  );
}

export default Footer;
