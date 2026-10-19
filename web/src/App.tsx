import { solicitacoesMock } from "./dados/solicitacoes-mock";
import type { Solicitacao } from "./tipos";

const formatadorMoeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

type ItemSolicitacaoProps = {
  solicitacao: Solicitacao;
};

type ListaSolicitacoesProps = {
  listaSolicitacao: Solicitacao[];
};

function ItemSolicitacao({ solicitacao }: ItemSolicitacaoProps) {
  return (
    <article
      style={{
        backgroundColor: "var(--color-surface, #1b1b1b)",
        border: "1px solid var(--color-border, #343434)",
        borderRadius: "var(--radius-sm, 6px)",
        padding: "var(--space-4, 1rem)",
        marginBottom: "var(--space-3, 0.75rem)",
      }}
    >
      <h3 style={{ fontSize: "var(--text-lg, 1.125rem)", margin: 0 }}>
        Cliente: {solicitacao.cliente}
      </h3>
      <p style={{ margin: "var(--space-1, 0.25rem) 0" }}>
        Status: <strong>{solicitacao.status}</strong>
      </p>
      <p style={{ margin: "var(--space-1, 0.25rem) 0" }}>
        Valor: {formatadorMoeda.format(solicitacao.valor)}
      </p>
      {solicitacao.observacao && (
        <p
          style={{
            margin: "var(--space-1, 0.25rem) 0",
            color: "var(--color-text-muted, #888)",
          }}
        >
          Observação: {solicitacao.observacao}
        </p>
      )}
    </article>
  );
}

function ListaSolicitacoes({ listaSolicitacao }: ListaSolicitacoesProps) {
  return (
    <section>
      {listaSolicitacao?.map((l) => (
        <ItemSolicitacao key={l.id} solicitacao={l} />
      ))}
    </section>
  );
}

function App() {
  return (
    <main
      style={{
        maxWidth: "var(--container-max, 72rem)",
        margin: "0 auto",
        padding: "var(--space-5, 1.5rem)",
      }}
    >
      <header style={{ marginBottom: "var(--space-6, 2rem)" }}>
        <h1
          style={{
            fontSize: "var(--text-3xl, 2.75rem)",
            color: "var(--color-primary, #c9a45c)",
          }}
        >
          Navalha
        </h1>
        <p style={{ color: "var(--color-text-muted, #b5ad9f)" }}>
          Painel Operacional de Agendamentos & Solicitações
        </p>
      </header>
      <ListaSolicitacoes listaSolicitacao={solicitacoesMock} />
    </main>
  );
}

export default App;
