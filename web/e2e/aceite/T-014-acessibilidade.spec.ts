// Teste de aceite do T-014, escrito pelo QA (IA). Se estiver errado, quem corrige é a IA.
import { expect, test } from "@playwright/test";
import { expectNoA11yViolations } from "../support/axe";
import { focusedName, gotoReady, resolveColor } from "../support/page";
import { DESKTOP, MOBILE } from "../support/viewports";

const tabOrder = [
  "Pular para o conteúdo",
  "Barbearia Navalha",
  "Serviços",
  "Barbeiros",
  "Depoimentos",
  "Contato",
  "Agendar horário",
  "Lista de depoimentos",
  "(11) 91234-5678",
  "Conversar no WhatsApp",
  "Voltar ao topo",
];

test.describe("no celular", () => {
  test.use({ viewport: MOBILE });

  test.beforeEach(async ({ page }) => {
    await gotoReady(page);
  });

  test("o link para pular só aparece quando recebe foco", async ({ page }) => {
    const skip = page.getByRole("link", { name: "Pular para o conteúdo" });
    await expect(skip).toHaveAttribute("href", "#conteudo");
    await expect(skip).not.toBeInViewport();
    await page.keyboard.press("Tab");
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport({ ratio: 1 });
  });

  test("o link leva o teclado direto para o conteúdo", async ({ page }) => {
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("link", { name: "Pular para o conteúdo" }),
    ).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#conteudo$/);
    // O Chromium move o ponto de partida do Tab no frame seguinte.
    await page.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    );
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("link", { name: "Agendar horário" }),
    ).toBeFocused();
  });

  // guarda de regressão: cada ticket já passou no axe da própria região; aqui é a página inteira.
  test("a página com o menu fechado passa no axe", async ({ page }) => {
    await expectNoA11yViolations(page);
  });

  // guarda de regressão: o menu aberto já passa desde o T-013; aqui é a página inteira.
  test("a página com o menu aberto passa no axe", async ({ page }) => {
    await page
      .getByRole("banner")
      .getByRole("button", { name: "Menu" })
      .click();
    await expectNoA11yViolations(page);
  });
});

test.describe("no desktop", () => {
  test.use({ viewport: DESKTOP });

  test.beforeEach(async ({ page }) => {
    await gotoReady(page);
  });

  test("o Tab segue a ordem da página, e todo foco fica visível", async ({
    page,
  }) => {
    const focusColor = await resolveColor(page, "--color-focus");
    const names: string[] = [];
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press("Tab");
      const name = await focusedName(page);
      if (name === "" || name === names[0]) break;
      names.push(name);
      // Com movimento reduzido, o reset vira toda mudança numa transição de 0,01ms:
      // a cor do contorno só aparece no frame seguinte, por isso o teste espera em vez de ler uma vez.
      const readOutline = () =>
        page.evaluate(() => {
          const style = getComputedStyle(document.activeElement as Element);
          return {
            style: style.outlineStyle,
            width: style.outlineWidth,
            color: style.outlineColor,
          };
        });
      await expect
        .poll(readOutline, { message: `contorno de foco em "${name}"` })
        .toEqual({ style: "solid", width: "3px", color: focusColor });
    }
    expect(names).toEqual(tabOrder);
  });

  // guarda de regressão: o T-012 já passa no axe no desktop; aqui o caso protege o link de pular e o foco.
  test("a página inteira passa no axe", async ({ page }) => {
    await expectNoA11yViolations(page);
  });
});
