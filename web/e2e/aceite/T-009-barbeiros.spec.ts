// Teste de aceite do T-009, escrito pelo QA (IA). Se estiver errado, quem corrige é a IA.
import { expect, test, type Page } from "@playwright/test";
import { barbers } from "../../src/data/barbers";
import { expectNoA11yViolations } from "../support/axe";
import { gotoReady, stableBox } from "../support/page";
import { DESKTOP, MOBILE } from "../support/viewports";

const cardOf = (page: Page, name: string) =>
  page
    .locator("section#barbeiros")
    .getByRole("article")
    .filter({
      has: page.getByRole("heading", { level: 3, name, exact: true }),
    });

test.beforeEach(async ({ page }) => {
  await gotoReady(page);
});

test("cada barbeiro vira um card com foto, nome e especialidades", async ({
  page,
}) => {
  await expect(
    page.locator("section#barbeiros").getByRole("article"),
  ).toHaveCount(barbers.length);
  for (const barber of barbers) {
    const card = cardOf(page, barber.name);
    await expect(card).toHaveCount(1);
    await expect(
      card.getByRole("img", { name: `Foto de ${barber.name}` }),
    ).toBeVisible();
    await expect(
      card.getByRole("list", { name: "Especialidades" }).getByRole("listitem"),
    ).toHaveText(barber.specialties);
  }
});

test.describe("no celular", () => {
  test.use({ viewport: MOBILE });

  test("as fotos ficam quadradas, até a que não é", async ({ page }) => {
    const photos = page.locator("section#barbeiros").getByRole("img");
    await expect(photos).toHaveCount(barbers.length);
    for (let index = 0; index < barbers.length; index++) {
      const box = await stableBox(photos.nth(index));
      expect(
        Math.abs(box.width - box.height),
        `foto ${index + 1}`,
      ).toBeLessThanOrEqual(1);
    }
  });

  test("os cards ficam em 2 colunas", async ({ page }) => {
    const cards = page.locator("section#barbeiros").getByRole("article");
    await expect(cards).toHaveCount(barbers.length);
    const [first, second] = await Promise.all([
      stableBox(cards.nth(0)),
      stableBox(cards.nth(1)),
    ]);
    expect(Math.abs(second.y - first.y)).toBeLessThanOrEqual(2);
  });

  // guarda de regressão: a seção de barbeiros já existe desde o T-003; aqui o caso protege os cards.
  test("a seção de barbeiros passa no axe", async ({ page }) => {
    await expectNoA11yViolations(page, { include: "section#barbeiros" });
  });
});

// No desktop sobra espaço no card em qualquer estado do marco; no celular, a folga é de
// poucos pixels e dependeria do padding que cada um escolhe para o card.
test.describe("no desktop", () => {
  test.use({ viewport: DESKTOP });

  test("as especialidades ficam lado a lado e quebram linha se faltar espaço", async ({
    page,
  }) => {
    for (const barber of barbers) {
      const list = cardOf(page, barber.name).getByRole("list", {
        name: "Especialidades",
      });
      const items = list.getByRole("listitem");
      await expect(items).toHaveCount(barber.specialties.length);
      await expect(list).toHaveCSS("flex-wrap", "wrap");
      const boxes = await Promise.all(
        barber.specialties.map((_, index) => stableBox(items.nth(index))),
      );
      for (const box of boxes) {
        expect(
          Math.abs(box.y - boxes[0].y),
          `especialidades de ${barber.name}`,
        ).toBeLessThanOrEqual(2);
      }
    }
  });
});
