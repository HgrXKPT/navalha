import { test, type Locator, type Page } from "@playwright/test";
import { mkdirSync } from "node:fs";

// SHOTS_URL: página a fotografar (padrão "/"; aceita file:///… para o desafio).
// SHOTS_DIR: pasta de saída (padrão .shots, que o git ignora).
const target = process.env.SHOTS_URL ?? "/";
const outDir = process.env.SHOTS_DIR ?? ".shots";

test.beforeAll(() => {
  mkdirSync(outDir, { recursive: true });
});

async function open(page: Page, width: number) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(target);
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
}

for (const width of [375, 768, 1280]) {
  test(`página inteira em ${width}px`, async ({ page }) => {
    await open(page, width);
    await page.screenshot({
      path: `${outDir}/pagina-${width}.png`,
      fullPage: true,
    });
  });
}

test("partes da página em 375px", async ({ page }) => {
  await open(page, 375);
  // O cabeçalho fixo cobriria o topo de cada recorte.
  await page.addStyleTag({
    content: "header { position: static !important; }",
  });
  const parts: { name: string; locator: Locator }[] = [
    { name: "cabecalho", locator: page.locator("header").first() },
    { name: "rodape", locator: page.locator("footer").first() },
  ];
  const ids = await page
    .locator("section[id]")
    .evaluateAll((sections) => sections.map((s) => s.id));
  for (const id of ids) {
    parts.push({ name: `secao-${id}`, locator: page.locator(`section#${id}`) });
  }
  for (const { name, locator } of parts) {
    if ((await locator.count()) > 0) {
      await locator.screenshot({ path: `${outDir}/${name}-375.png` });
    }
  }
});

test("menu aberto em 375px", async ({ page }) => {
  await open(page, 375);
  const button = page.getByRole("button", { name: "Menu" });
  test.skip((await button.count()) === 0, "ainda não existe o botão de menu");
  await button.click();
  await page
    .locator("header")
    .first()
    .screenshot({ path: `${outDir}/menu-aberto-375.png` });
});

test("foco no primeiro Tab em 375px", async ({ page }) => {
  await open(page, 375);
  await page.keyboard.press("Tab");
  await page.screenshot({ path: `${outDir}/foco-375.png` });
});
