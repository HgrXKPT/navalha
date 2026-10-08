// Teste de aceite do T-008, escrito pelo QA (IA). Se estiver errado, quem corrige é a IA.
import { expect, test, type Page } from "@playwright/test";
import { gotoReady, stableBox } from "../support/page";
import { DESKTOP, MOBILE, TABLET } from "../support/viewports";

const cardBoxes = async (page: Page, count: number) => {
  const cards = page.locator("section#servicos").getByRole("article");
  await expect(cards.nth(count - 1)).toBeVisible();
  return Promise.all(
    Array.from({ length: count }, (_, index) => stableBox(cards.nth(index))),
  );
};

test.describe("no tablet", () => {
  test.use({ viewport: TABLET });

  test("os cards ficam em 2 colunas", async ({ page }) => {
    await gotoReady(page);
    const [first, second, third] = await cardBoxes(page, 3);
    expect(Math.abs(second.y - first.y)).toBeLessThanOrEqual(2);
    expect(third.y).toBeGreaterThan(first.y + 2);
  });
});

test.describe("no desktop", () => {
  test.use({ viewport: DESKTOP });

  test("os cards ficam em 3 colunas", async ({ page }) => {
    await gotoReady(page);
    const [first, second, third, fourth] = await cardBoxes(page, 4);
    expect(Math.abs(second.y - first.y)).toBeLessThanOrEqual(2);
    expect(Math.abs(third.y - first.y)).toBeLessThanOrEqual(2);
    expect(fourth.y).toBeGreaterThan(first.y + 2);
  });
});

test.describe("no celular", () => {
  test.use({ viewport: MOBILE });

  // guarda de regressão: sem grade, os cards já ficam um embaixo do outro; aqui o caso protege o celular.
  test("os cards ficam em 1 coluna, sem rolagem horizontal", async ({
    page,
  }) => {
    await gotoReady(page);
    const boxes = await cardBoxes(page, 3);
    for (let index = 1; index < boxes.length; index++) {
      expect(boxes[index].y).toBeGreaterThanOrEqual(
        boxes[index - 1].y + boxes[index - 1].height - 1,
      );
    }
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
