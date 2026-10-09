// Teste de aceite do T-006, escrito pelo QA (IA). Se estiver errado, quem corrige é a IA.
import { expect, test } from "@playwright/test";
import { expectNoA11yViolations } from "../support/axe";
import { focusedName, gotoReady, resolveColor } from "../support/page";
import { MOBILE } from "../support/viewports";

test.beforeEach(async ({ page }) => {
  await gotoReady(page);
});

test("o hero tem a chamada e o botão para agendar", async ({ page }) => {
  const hero = page.locator("section#inicio");
  await expect(
    hero.locator("p", { hasText: "sem fila e sem espera" }),
  ).toBeVisible();
  await expect(
    hero.getByRole("link", { name: "Agendar horário" }),
  ).toHaveAttribute("href", "#servicos");
});

test("o hero tem a imagem de fundo", async ({ page }) => {
  const background = await page
    .locator("section#inicio")
    .evaluate((el) => getComputedStyle(el).backgroundImage);
  expect(background).toContain("url(");
});

test("o botão usa a cor primária e clareia com o mouse em cima", async ({
  page,
}) => {
  const button = page.getByRole("link", { name: "Agendar horário" });
  await expect(button).toHaveCSS(
    "background-color",
    await resolveColor(page, "--color-primary"),
  );
  await button.hover();
  await expect(button).toHaveCSS(
    "background-color",
    await resolveColor(page, "--color-primary-strong"),
  );
});

test("o botão mostra o contorno de foco ao navegar pelo teclado", async ({
  page,
}) => {
  const button = page.getByRole("link", { name: "Agendar horário" });
  for (
    let i = 0;
    i < 15 && (await focusedName(page)) !== "Agendar horário";
    i++
  ) {
    await page.keyboard.press("Tab");
  }
  await expect(button).toBeFocused();
  await expect(button).toHaveCSS("outline-style", "solid");
  await expect(button).toHaveCSS("outline-width", "3px");
  await expect(button).toHaveCSS(
    "outline-color",
    await resolveColor(page, "--color-focus"),
  );
});

test.describe("no celular", () => {
  test.use({ viewport: MOBILE });

  // guarda de regressão: a seção de início já existe desde o T-003; aqui o caso protege o hero dos tickets seguintes.
  test("o hero passa no axe", async ({ page }) => {
    await gotoReady(page);
    await expectNoA11yViolations(page, { include: "section#inicio" });
  });
});
