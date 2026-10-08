// Teste de aceite do T-001, escrito pelo QA (IA). Se estiver errado, quem corrige é a IA.
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("a página está em português do Brasil", async ({ page }) => {
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
});

test("a aba mostra o título da barbearia", async ({ page }) => {
  await expect(page).toHaveTitle("Barbearia Navalha · Agende seu horário");
});

test("o ícone da aba é o da Navalha", async ({ page }) => {
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute(
    "href",
    "/favicon.svg",
  );
  const response = await page.request.get("/favicon.svg");
  expect(response.ok()).toBe(true);
  const isNavalha = (await response.text()).includes("Barbearia Navalha");
  expect(
    isNavalha,
    "o /favicon.svg ainda não é o da Navalha: copie design/favicon.svg por cima de web/public/favicon.svg",
  ).toBe(true);
});
