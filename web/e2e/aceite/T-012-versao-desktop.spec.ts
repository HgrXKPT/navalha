// Teste de aceite do T-012, escrito pelo QA (IA). Se estiver errado, quem corrige é a IA.
import { expect, test, type Locator } from "@playwright/test";
import { expectNoA11yViolations } from "../support/axe";
import { gotoReady, stableBox } from "../support/page";
import { DESKTOP, MOBILE, WIDE } from "../support/viewports";

const sameRow = async (items: Locator, count: number) => {
  await expect(items.nth(count - 1)).toBeVisible();
  const boxes = await Promise.all(
    Array.from({ length: count }, (_, index) => stableBox(items.nth(index))),
  );
  for (const box of boxes)
    expect(Math.abs(box.y - boxes[0].y)).toBeLessThanOrEqual(2);
};

test.describe("no desktop", () => {
  test.use({ viewport: DESKTOP });

  test.beforeEach(async ({ page }) => {
    await gotoReady(page);
  });

  test("logo e menu ficam na mesma linha", async ({ page }) => {
    const logo = await stableBox(
      page.getByRole("banner").getByRole("link", { name: "Barbearia Navalha" }),
    );
    const first = await stableBox(
      page
        .getByRole("navigation", { name: "Principal" })
        .getByRole("link", { name: "Serviços", exact: true }),
    );
    const center = (box: { y: number; height: number }) =>
      box.y + box.height / 2;
    expect(Math.abs(center(logo) - center(first))).toBeLessThanOrEqual(8);
  });

  test("os barbeiros ficam em 4 colunas", async ({ page }) => {
    await sameRow(page.locator("section#barbeiros").getByRole("article"), 4);
  });

  test("os depoimentos viram uma grade de 3 colunas, sem rolagem", async ({
    page,
  }) => {
    const list = page.getByRole("list", { name: "Lista de depoimentos" });
    const overflow = await list.evaluate(
      (el) => el.scrollWidth - el.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
    await sameRow(page.locator("section#depoimentos figure"), 3);
  });

  test("o endereço e a tabela de horários ficam lado a lado", async ({
    page,
  }) => {
    const address = await stableBox(page.locator("section#contato address"));
    const table = await stableBox(
      page.getByRole("table", { name: "Horário de funcionamento" }),
    );
    expect(table.x).toBeGreaterThanOrEqual(address.x + address.width - 1);
  });

  // guarda de regressão: a página mobile-first também passa no axe; aqui o caso protege o layout de desktop.
  test("a página inteira passa no axe", async ({ page }) => {
    await expectNoA11yViolations(page);
  });
});

test.describe("numa tela larga", () => {
  test.use({ viewport: WIDE });

  test("o conteúdo fica centralizado, com largura máxima", async ({ page }) => {
    await gotoReady(page);
    const list = await stableBox(page.locator("section#servicos ul").first());
    const viewportWidth = await page.evaluate(
      () => document.documentElement.clientWidth,
    );
    expect(list.width).toBeLessThanOrEqual(1153);
    const left = list.x;
    const right = viewportWidth - (list.x + list.width);
    expect(Math.abs(left - right)).toBeLessThanOrEqual(2);
  });
});

for (const [label, viewport] of [
  ["no celular", MOBILE],
  ["no desktop", DESKTOP],
] as const) {
  test.describe(label, () => {
    test.use({ viewport });

    // guarda de regressão: o site mobile-first já não rola na horizontal; aqui o caso protege as media queries.
    test("a página não rola na horizontal", async ({ page }) => {
      await gotoReady(page);
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  });
}
