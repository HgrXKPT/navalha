// Teste de aceite do T-007, escrito pelo QA (IA). Se estiver errado, quem corrige é a IA.
import { expect, test, type Page } from "@playwright/test";
import { services } from "../../src/data/services";
import { expectNoA11yViolations } from "../support/axe";
import { gotoReady } from "../support/page";

// O Intl põe um espaço especial entre "R$" e o número; por isso o teste usa regex com \s.
const amount = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const escapeRegExp = (text: string) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const cardOf = (page: Page, name: string) =>
  page
    .locator("section#servicos")
    .getByRole("article")
    .filter({
      has: page.getByRole("heading", { level: 3, name, exact: true }),
    });

test.beforeEach(async ({ page }) => {
  await gotoReady(page);
});

test("cada serviço vira um card", async ({ page }) => {
  await expect(
    page.locator("section#servicos").getByRole("article"),
  ).toHaveCount(services.length);
});

for (const service of services) {
  test(`o card de ${service.name} mostra nome, preço e duração`, async ({
    page,
  }) => {
    const card = cardOf(page, service.name);
    await expect(card).toHaveCount(1);
    const price = new RegExp(
      `R\\$\\s*${escapeRegExp(amount.format(service.price))}`,
    );
    await expect(card).toContainText(price);
    await expect(card).toContainText(`${service.durationMinutes} min`);
  });
}

test("só os serviços populares têm o selo Mais pedido", async ({ page }) => {
  const section = page.locator("section#servicos");
  await expect(section.getByText("Mais pedido", { exact: true })).toHaveCount(
    services.filter((service) => service.popular).length,
  );
  for (const service of services) {
    await expect(
      cardOf(page, service.name).getByText("Mais pedido", { exact: true }),
      `selo no card de ${service.name}`,
    ).toHaveCount(service.popular ? 1 : 0);
  }
});

// guarda de regressão: a seção de serviços já existe desde o T-003; aqui o caso protege os cards dos tickets seguintes.
test("a seção de serviços passa no axe", async ({ page }) => {
  await expectNoA11yViolations(page, { include: "section#servicos" });
});
