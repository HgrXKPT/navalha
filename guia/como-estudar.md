# Como estudar (leia uma vez, 10 min)

Seu tempo é curto, então o método pesa mais que a quantidade de horas. Cada regra abaixo tem um motivo.

## 1. O ciclo do dia

- **Aquecimento (5 min): recuperação ativa.** Tentar lembrar sem consultar fixa muito mais do que reler. Errar no aquecimento faz parte, porque mostra o que precisa voltar.
- **Estudo (20 a 40 min): ler com uma pergunta na cabeça.** Antes de abrir qualquer link, leia o "Pronto quando" do dia. Você lê para conseguir fazer aquilo.
- **Prática (30 a 70 min): é aqui que o aprendizado acontece.** Ler sobre `useState` não ensina `useState`. Digitar, errar e consertar ensina.
- **Decisão do dia (5 a 10 min, dentro da Prática): registrar a escolha.** Nos dias com ADR, escreva em `decisoes/` qual opção você escolheu, com qual critério e o que faria você mudar de ideia. Decisão escrita vira critério reutilizável; decisão só pensada some.
- **Fechamento (5 min): explicar com suas palavras.** Se você não consegue explicar o assunto para um colega de backend, ainda não entendeu. Essa é a técnica de Feynman, e o `/fechar-dia` faz isso com você.

## 2. Versão de 1h ou de 2h

- **Com 1h:** faça só as tarefas **Essencial**. Isso basta para acompanhar o plano.
- **Com 2h:** faça também as **Extra**. Elas aprofundam o assunto, mas não são pré-requisito do dia seguinte.

## 3. Quando travar

- **De 0 a 15 min, insista.** Leia a mensagem de erro inteira, de cima para baixo. Releia o link do Estudo. Use `console.log` para ver o valor real da variável.
- **Aos 15 min, use `/dica`.** A IA dá uma dica por vez, e você tenta de novo entre uma e outra.
- **Se ainda travar depois de 3 dicas,** peça a solução. Entenda linha a linha, **apague** e reescreva de memória. Depois registre o ponto em Pendências.

## 4. Lendo erros (o que muda em relação ao .NET)

- No front, os erros aparecem em **3 lugares**, e vale olhar os três:
  - **terminal** (`npm run dev`): erros de build;
  - **console do navegador** (F12 → Console): erros de execução;
  - **aba Network** (F12 → Network): requisições HTTP, com status e corpo.
- O sublinhado vermelho do TypeScript no editor faz o papel do compilador. Não ignore.
- O stack trace do React costuma apontar o componente. Procure o primeiro arquivo que é **seu**, não o que está em `node_modules`.

## 5. Usando a IA sem aprender errado

- **No Estudo, peça explicação, não código.** Por exemplo: "explique X comparando com C#".
- **Na Prática, escreva primeiro** e use `/revisar` depois.
- **Desconfie de resposta desatualizada.** Os sinais são `create-react-app`, class components, `componentDidMount`, `ReactDOM.render` e `react-router-dom`.
- **Não aceite código que você não sabe explicar.**
- **A IA também erra.** Se ela contradisser a doc oficial (react.dev, MDN), vale a doc.

## 6. Se atrasar

- **Não pule dias. Empurre o calendário.** O dia 7 depende do 6, e o dia 9 depende dos dias 6 a 8.
- **Só tem 30 min hoje?** Faça o aquecimento e uma tarefa essencial. Constância rende mais que maratona.
- **O "Pronto quando" não bateu?** Marque 🟨 e siga. O aquecimento dos dias seguintes traz o tema de volta.

## 7. O que não fazer

- **Não assista a um curso em vídeo de várias horas.** Consome todo o seu tempo e quase não tem prática.
- **Não estude Redux, Next.js ou Vue agora.** Fica para depois do plano.
- **Não copie da IA e siga em frente.** Você chegaria ao dia 17 sem conseguir fazer nada sozinho.
- **Não busque perfeição visual.** Deixar o CSS bonito é o último passo, não o primeiro.
