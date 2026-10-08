// Teste de aceite do T-013, escrito pelo QA (IA). Se estiver errado, quem corrige é a IA.
import { expect, test } from "@playwright/test";
import { expectNoA11yViolations } from "../support/axe";
import { focusedName, gotoReady } from "../support/page";
import { DESKTOP, MOBILE } from "../support/viewports";

const links = ["Serviços", "Barbeiros", "Depoimentos", "Contato"];

test.describe("no celular", () => {
  test.use({ viewport: MOBILE });

  test.beforeEach(async ({ page }) => {
    await gotoReady(page);
  });

  test("o menu começa fechado", async ({ page }) => {
    const button = page
      .getByRole("banner")
      .getByRole("button", { name: "Menu" });
    await expect(button).toBeVisible();
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(button).toHaveAttribute("aria-controls", "menu-principal");
    await expect(page.locator("#menu-principal")).toBeHidden();
  });

  test("com o menu fechado, o Tab pula os links", async ({ page }) => {
    for (let i = 0; i < 5 && (await focusedName(page)) !== "Menu"; i++) {
      await page.keyboard.press("Tab");
    }
    expect(await focusedName(page)).toBe("Menu");
    await page.keyboard.press("Tab");
    expect(links).not.toContain(await focusedName(page));
  });

  test("o botão abre e fecha o menu", async ({ page }) => {
    const button = page
      .getByRole("banner")
      .getByRole("button", { name: "Menu" });
    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "true");
    for (const name of links) {
      await expect(
        page
          .locator("#menu-principal")
          .getByRole("link", { name, exact: true }),
      ).toBeVisible();
    }
    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#menu-principal")).toBeHidden();
  });

  test("escolher um link fecha o menu e vai para a seção", async ({ page }) => {
    const button = page
      .getByRole("banner")
      .getByRole("button", { name: "Menu" });
    await button.click();
    await page
      .locator("#menu-principal")
      .getByRole("link", { name: "Barbeiros", exact: true })
      .click();
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(page).toHaveURL(/#barbeiros$/);
  });

  test("o cabeçalho com o menu aberto passa no axe", async ({ page }) => {
    await page
      .getByRole("banner")
      .getByRole("button", { name: "Menu" })
      .click();
    await expectNoA11yViolations(page, { include: "header" });
  });
});

test.describe("no desktop", () => {
  test.use({ viewport: DESKTOP });

  // guarda de regressão: no T-012 já não existe botão e os links já aparecem; aqui o caso protege o desktop.
  test("não tem botão de menu, e os links ficam à mostra", async ({ page }) => {
    await gotoReady(page);
    await expect(page.getByRole("button", { name: "Menu" })).toBeHidden();
    const nav = page.getByRole("navigation", { name: "Principal" });
    for (const name of links) {
      await expect(nav.getByRole("link", { name, exact: true })).toBeVisible();
    }
  });
});
