// Teste de aceite do T-011, escrito pelo QA (IA). Se estiver errado, quem corrige é a IA.
import { expect, test } from "@playwright/test";
import { business } from "../../src/data/business";
import { expectNoA11yViolations } from "../support/axe";
import { gotoReady, stableBox } from "../support/page";
import { DESKTOP, MOBILE } from "../support/viewports";

test.beforeEach(async ({ page }) => {
  await gotoReady(page);
});

test("o horário de funcionamento é uma tabela com cabeçalhos", async ({
  page,
}) => {
  const table = page.getByRole("table", { name: "Horário de funcionamento" });
  await expect(table.getByRole("columnheader")).toHaveText(["Dia", "Horário"]);
  await expect(table.getByRole("rowheader")).toHaveText(
    business.openingHours.map((line) => line.day),
  );
  for (const line of business.openingHours) {
    const row = table.getByRole("row").filter({
      has: page.getByRole("rowheader", { name: line.day, exact: true }),
    });
    await expect(row.getByRole("cell")).toHaveText(line.hours);
  }
});

test("o endereço e os contatos ficam no address", async ({ page }) => {
  const address = page.locator("section#contato address");
  await expect(address).toContainText(business.address.street);
  await expect(
    address.getByRole("link", { name: business.phone.display }),
  ).toHaveAttribute("href", business.phone.href);
  await expect(
    address.getByRole("link", { name: "Conversar no WhatsApp" }),
  ).toHaveAttribute("href", business.whatsappUrl);
});

test("o rodapé tem o link para voltar ao topo", async ({ page }) => {
  await expect(
    page.getByRole("contentinfo").getByRole("link", { name: "Voltar ao topo" }),
  ).toHaveAttribute("href", "#inicio");
});

for (const [label, viewport] of [
  ["no celular", MOBILE],
  ["no desktop", DESKTOP],
] as const) {
  test.describe(label, () => {
    test.use({ viewport });

    test("o cabeçalho continua visível depois de rolar até o fim", async ({
      page,
    }) => {
      await page.evaluate(() =>
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "instant",
        }),
      );
      await expect
        .poll(() => page.evaluate(() => window.scrollY))
        .toBeGreaterThan(0);
      const header = await stableBox(page.getByRole("banner"));
      expect(header.y).toBeGreaterThanOrEqual(-1);
      expect(header.y).toBeLessThanOrEqual(1);
    });
  });
}

test.describe("no desktop", () => {
  test.use({ viewport: DESKTOP });

  test("ao escolher uma seção no menu, o título não fica atrás do cabeçalho", async ({
    page,
  }) => {
    await page
      .getByRole("navigation", { name: "Principal" })
      .getByRole("link", { name: "Serviços", exact: true })
      .click();
    await expect(page).toHaveURL(/#servicos$/);
    const header = await stableBox(page.getByRole("banner"));
    const title = await stableBox(page.locator("section#servicos h2"));
    expect(header.y).toBeGreaterThanOrEqual(-1);
    expect(header.y).toBeLessThanOrEqual(1);
    expect(title.y).toBeGreaterThanOrEqual(header.y + header.height - 1);
  });
});

// guarda de regressão: a seção de contato e o rodapé já existem desde o T-003; aqui o caso protege o conteúdo novo.
test("o contato e o rodapé passam no axe", async ({ page }) => {
  await expectNoA11yViolations(page, { include: "section#contato" });
  await expectNoA11yViolations(page, { include: "footer" });
});
