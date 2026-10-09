import logo from "./assets/logo.svg";

function App() {
  return (
    <>
      <header>
        <a href="#inicio">
          <img src={logo} alt="Barbearia Navalha" />
        </a>

        <nav aria-label="Principal">
          <ul>
            <li>
              <a href="#servicos">Serviços</a>
            </li>
            <li>
              <a href="#barbeiros">Barbeiros</a>
            </li>
            <li>
              <a href="#depoimentos">Depoimentos</a>
            </li>
            <li>
              <a href="#contato">Contato</a>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        <section id="inicio">
          <h1>Seu corte com hora marcada</h1>
        </section>
        <section id="servicos">
          <h2>Serviços</h2>
        </section>
        <section id="barbeiros">
          <h2>Barbeiros</h2>
        </section>
        <section id="depoimentos">
          <h2>Depoimentos</h2>
        </section>
        <section id="contato">
          <h2>Contato</h2>
        </section>
      </main>

      <footer>
        <p>© 2026 Barbearia Navalha.</p>
      </footer>
    </>
  );
}

export default App;
