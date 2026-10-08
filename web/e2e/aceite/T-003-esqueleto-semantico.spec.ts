// Teste de aceite do T-003, escrito pelo QA (IA). Se estiver errado, quem corrige é a IA.
import { expect, test } from "@playwright/test";
import { expectNoA11yViolations } from "../support/axe";

const sections = [
  { id: "servicos", title: "Serviços" },
  { id: "barbeiros", title: "Barbeiros" },
  { id: "depoimentos", title: "Depoimentos" },
  { id: "contato", title: "Contato" },
];

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("a página tem cabeçalho, navegação, conteúdo principal e rodapé", async ({
  page,
}) => {
  await expect(page.getByRole("banner")).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Principal" }),
  ).toBeAttached();
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.getByRole("contentinfo")).toBeVisible();
});

test("o logo é um link para o início", async ({ page }) => {
  const logo = page
    .getByRole("banner")
    .getByRole("link", { name: "Barbearia Navalha" });
  await expect(logo).toHaveAttribute("href", "#inicio");
});

test("a navegação leva para cada seção", async ({ page }) => {
  const nav = page.getByRole("navigation", { name: "Principal" });
  for (const { id, title } of sections) {
    await expect(
      nav.getByRole("link", { name: title, exact: true }),
    ).toHaveAttribute("href", `#${id}`);
  }
});

test("existe um único h1, dentro da seção de início", async ({ page }) => {
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.locator("main section#inicio h1")).toHaveText(
    "Seu corte com hora marcada",
  );
});

test("cada seção tem o seu h2", async ({ page }) => {
  for (const { id, title } of sections) {
    await expect(page.locator(`main section#${id} h2`)).toHaveText(title);
  }
});

test("o rodapé tem o copyright", async ({ page }) => {
  await expect(page.getByRole("contentinfo")).toContainText(
    "© 2026 Barbearia Navalha",
  );
});

// guarda de regressão: o axe também passa no esqueleto vazio; aqui ele protege a estrutura dos tickets seguintes.
test("a página inteira passa no axe", async ({ page }) => {
  await expectNoA11yViolations(page);
});
