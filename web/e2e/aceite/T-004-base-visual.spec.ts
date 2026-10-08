// Teste de aceite do T-004, escrito pelo QA (IA). Se estiver errado, quem corrige é a IA.
import { expect, test } from "@playwright/test";
import { expectNoA11yViolations } from "../support/axe";
import { gotoReady, resolveColor } from "../support/page";

test.beforeEach(async ({ page }) => {
  await gotoReady(page);
});

test("o fundo e o texto da página usam os tokens", async ({ page }) => {
  const body = page.locator("body");
  await expect(body).toHaveCSS(
    "background-color",
    await resolveColor(page, "--color-bg"),
  );
  await expect(body).toHaveCSS(
    "color",
    await resolveColor(page, "--color-text"),
  );
});

test("o texto corrido usa a fonte do corpo", async ({ page }) => {
  const family = await page
    .locator("body")
    .evaluate((el) => getComputedStyle(el).fontFamily);
  expect(family).toContain("Inter");
});

test("os títulos usam a fonte de destaque", async ({ page }) => {
  for (const heading of [page.locator("h1"), page.locator("h2").first()]) {
    const family = await heading.evaluate(
      (el) => getComputedStyle(el).fontFamily,
    );
    expect(family).toContain("Oswald");
  }
});

test("um link no meio do texto usa a cor primária e fica sublinhado", async ({
  page,
}) => {
  // Sonda: um parágrafo com link, que só depende do base.css e de nenhum componente.
  await page.locator("main").evaluate((main) => {
    const paragraph = document.createElement("p");
    paragraph.innerHTML =
      'Texto com <a href="#sonda" id="sonda">um link</a> no meio.';
    main.append(paragraph);
  });
  const link = page.locator("#sonda");
  await expect(link).toHaveCSS(
    "color",
    await resolveColor(page, "--color-primary"),
  );
  const decoration = await link.evaluate(
    (el) => getComputedStyle(el).textDecorationLine,
  );
  expect(decoration).toContain("underline");
});

test("as seções têm o respiro da escala de espaço", async ({ page }) => {
  const section = page.locator("section#servicos");
  await expect(section).toHaveCSS("padding-top", "48px");
  await expect(section).toHaveCSS("padding-bottom", "48px");
});

// guarda de regressão: preto sobre branco, o padrão do navegador, também passa; aqui o caso protege as cores dos tickets seguintes.
test("as cores da página têm contraste suficiente", async ({ page }) => {
  await expectNoA11yViolations(page, { rules: ["color-contrast"] });
});
