# Dia 02 — Componentes e props

- **Data:** 2026-10-06
- **Tempo:** 1h
- **Confiança (1–5):** 4

## Em uma frase, o que aprendi hoje

Um componente no React é uma função pura que recebe props como parâmetros e devolve interface gráfica (JSX), sendo estruturado por composição na árvore de componentes.

## Explicando para um colega de backend

Imagine Prop como se vc estivesse declarando uma variavel que vá entrar em um método, vc denomina o tipo dela e qual valor ela deve receber, e componentes vc pode imaginar vc tendo um Handle no c#, e dentro deles métodos que levam para fluxos, por exemplo um Handle de pagamento, e 2 metodos, um de enviar email e outro de enviar cupom, cada componente seria um método novo

### Correção da IA

- **O que está certo:** A analogia de Props como parâmetros de entrada de um método (com tipos e valores passados pelo chamador) está precisa. Props são argumentos imutáveis da função.
- **O que falta:** O componente tem como saída obrigatória elementos de UI (JSX / ReactNode). Não é apenas um método de fluxo genérico, mas um bloco de renderização visual chamado novamente a cada render.
- **O que está errado:** Comparar componentes a métodos com efeitos colaterais de negócio (como disparar e-mail ou cupom dentro de um Handler). No React, o componente deve ser uma função pura que apenas projeta estado/props em tela; ações imperativas pertencem a handlers de eventos.

## Onde travei e como saí

n travei

## Dúvida em aberto

## Erros do quiz
