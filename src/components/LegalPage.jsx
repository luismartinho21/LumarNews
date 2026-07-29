function LegalPage({ pageType, onBack }) {
  const isPrivacy = pageType === "privacy";

  return (
    <div className="legal-page glass-panel">
      <button className="back-btn" onClick={onBack}>
        &larr; Voltar às notícias
      </button>

      {isPrivacy ? (
        <div className="legal-content">
          <h2>Política de Privacidade</h2>
          <p>Última atualização: {new Date().toLocaleDateString("pt-PT")}</p>

          <h3>1. Introdução</h3>
          <p>
            O LumarNews ("nós", "nosso") respeita a sua privacidade. Esta
            Política de Privacidade explica como recolhemos, usamos e protegemos
            a sua informação quando visita a nossa aplicação web.
          </p>

          <h3>2. Recolha e Uso de Dados</h3>
          <p>
            Não recolhemos dados pessoais sensíveis, como nomes, moradas ou
            números de telefone. A nossa aplicação é um agregador de feeds RSS
            públicos.
          </p>

          <h3>3. Uso de Armazenamento Local (Cookies e LocalStorage)</h3>
          <p>
            Utilizamos o <strong>LocalStorage</strong> do seu navegador web
            para:
          </p>
          <ul>
            <li>Guardar as suas preferências de tema e fontes de notícias.</li>
            <li>
              Guardar uma cache local das últimas notícias lidas, de modo a
              poupar dados móveis e acelerar a navegação.
            </li>
            <li>Registar o seu consentimento sobre o aviso de cookies.</li>
          </ul>
          <p>
            Não utilizamos cookies de rastreamento (tracking) para fins de
            publicidade direcionada.
          </p>

          <h3>4. Ligações a Terceiros</h3>
          <p>
            O nosso serviço agrega conteúdos de sites de terceiros (incluindo
            RTP, SIC, CNN Portugal, Record, A Bola, O Jogo, SAPO, Notícias ao
            Minuto, Observador, Público, entre outros). Ao clicar para ler a
            notícia original, será reencaminhado para esses sites, que possuem
            as suas próprias Políticas de Privacidade, pelas quais não somos
            responsáveis.
          </p>

          <h3>5. Contactos</h3>
          <p>
            Se tiver alguma questão sobre esta Política de Privacidade, por
            favor contacte-nos através do e-mail:{" "}
            <strong>lutinhopes@gmail.com</strong>.
          </p>
        </div>
      ) : (
        <div className="legal-content">
          <h2>Termos e Condições</h2>
          <p>Última atualização: {new Date().toLocaleDateString("pt-PT")}</p>

          <h3>1. Aceitação dos Termos</h3>
          <p>
            Ao aceder à aplicação LumarNews, o utilizador concorda em cumprir
            estes Termos e Condições de uso. Se não concordar com alguma parte
            destes termos, não deve utilizar o serviço.
          </p>

          <h3>2. Natureza do Serviço</h3>
          <p>
            O LumarNews atua exclusivamente como um agregador de conteúdos
            jornalísticos, recolhendo informações públicas disponibilizadas via
            RSS pelos vários órgãos de comunicação social (jornais, televisões e
            portais web).
          </p>

          <h3>3. Propriedade Intelectual e Direitos Reservados</h3>
          <p>
            Todos os textos, imagens, logótipos e conteúdos noticiosos
            apresentados são propriedade exclusiva dos seus respetivos autores e
            órgãos de comunicação social (incluindo, mas não limitando a: Cofina
            Media, Global Media Group, Impresa, RTP, Media Capital, SAPO,
            Observador, Público, etc.). O LumarNews não detém quaisquer direitos
            de autor sobre as notícias agregadas, servindo apenas como um
            diretório que redireciona o tráfego para os sites originais.
          </p>

          <h3>4. Exoneração de Responsabilidade</h3>
          <p>
            Não nos responsabilizamos pela veracidade, exatidão ou conteúdo das
            notícias apresentadas, uma vez que estas são geradas por terceiros.
            A leitura completa e interpretação dos factos deve ser sempre
            validada junto da fonte original.
          </p>
        </div>
      )}
    </div>
  );
}

export default LegalPage;
