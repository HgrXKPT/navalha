// Teste de aceite do T-005, escrito pelo QA (IA). Se estiver errado, quem corrige é a IA.
import { expect, test } from "@playwright/test";
import { expectNoA11yViolations } from "../support/axe";
import { gotoReady, stableBox } from "../support/page";
import { DESKTOP, MOBILE } from "../support/viewports";

const links = ["Serviços", "Barbeiros", "Depoimentos", "Contato"];

test.describe("no desktop", () => {
  test.use({ viewport: DESKTOP });

  test.beforeEach(async ({ page }) => {
    await gotoReady(page);
  });

  test("os links do menu ficam lado a lado, na mesma linha", async ({
    page,
  }) => {
    const nav = page.getByRole("navigation", { name: "Principal" });
    const boxes = await Promise.all(
      links.map((name) =>
        stableBox(nav.getByRole("link", { name, exact: true })),
      ),
    );
    for (const box of boxes)
      expect(Math.abs(box.y - boxes[0].y)).toBeLessThanOrEqual(2);
  });

  test("cada link tem área de toque de pelo menos 44px de altura", async ({
    page,
  }) => {
    const nav = page.getByRole("navigation", { name: "Principal" });
    for (const name of links) {
      const box = await stableBox(nav.getByRole("link", { name, exact: true }));
      expect(box.height, `altura do link "${name}"`).toBeGreaterThanOrEqual(44);
    }
  });

  // guarda de regressão: o cabeçalho sem estilo também passa; aqui o caso protege o que vem depois.
  test("o cabeçalho passa no axe", async ({ page }) => {
    await expectNoA11yViolations(page, { include: "header" });
  });
});

test.describe("no celular", () => {
  test.use({ viewport: MOBILE });

  // guarda de regressão: o cabeçalho sem estilo também passa; aqui o caso protege o que vem depois.
  test("o cabeçalho passa no axe", async ({ page }) => {
    await gotoReady(page);
    await expectNoA11yViolations(page, { include: "header" });
  });
});
