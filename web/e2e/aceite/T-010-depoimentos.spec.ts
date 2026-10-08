// Teste de aceite do T-010, escrito pelo QA (IA). Se estiver errado, quem corrige é a IA.
import { expect, test } from "@playwright/test";
import { testimonials } from "../../src/data/testimonials";
import { expectNoA11yViolations } from "../support/axe";
import { gotoReady } from "../support/page";
import { MOBILE } from "../support/viewports";

test.beforeEach(async ({ page }) => {
  await gotoReady(page);
});

test("cada depoimento é uma citação com autor", async ({ page }) => {
  const figures = page.locator("section#depoimentos figure");
  await expect(figures).toHaveCount(testimonials.length);
  for (const testimonial of testimonials) {
    const figure = figures.filter({ hasText: testimonial.author });
    await expect(figure.locator("blockquote")).toContainText(testimonial.quote);
    await expect(figure.locator("figcaption")).toContainText(
      testimonial.author,
    );
  }
});

test("a lista de depoimentos é alcançável pelo teclado", async ({ page }) => {
  await expect(
    page.getByRole("list", { name: "Lista de depoimentos" }),
  ).toHaveAttribute("tabindex", "0");
});

test.describe("no celular", () => {
  test.use({ viewport: MOBILE });

  test("a faixa rola na horizontal e encaixa em cada depoimento", async ({
    page,
  }) => {
    const list = page.getByRole("list", { name: "Lista de depoimentos" });
    const scroller = await list.evaluate((el) => {
      const style = getComputedStyle(el);
      return {
        overflowX: style.overflowX,
        snapType: style.scrollSnapType,
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
      };
    });
    expect(["auto", "scroll"]).toContain(scroller.overflowX);
    expect(scroller.snapType).toContain("x");
    expect(scroller.scrollWidth).toBeGreaterThan(scroller.clientWidth);
  });

  // guarda de regressão: antes da faixa a página também não rola; aqui o caso garante que a faixa não vaze.
  test("a página não rola na horizontal", async ({ page }) => {
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  // guarda de regressão: a seção de depoimentos já existe desde o T-003; aqui o caso protege a faixa.
  test("a seção de depoimentos passa no axe", async ({ page }) => {
    await expectNoA11yViolations(page, { include: "section#depoimentos" });
  });
});
