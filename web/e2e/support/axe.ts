import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

type Options = {
  /** Seletor CSS da região analisada. Sem ele, o axe analisa a página inteira. */
  include?: string;
  /** Limita a análise a estas regras do axe (por exemplo, ["color-contrast"]). */
  rules?: string[];
};

// Falha listando as violações em texto, para a mensagem do teste já dizer o que corrigir.
export async function expectNoA11yViolations(
  page: Page,
  { include, rules }: Options = {},
) {
  let builder = new AxeBuilder({ page }).withTags([
    "wcag2a",
    "wcag2aa",
    "wcag21a",
    "wcag21aa",
  ]);
  if (include) {
    await expect(page.locator(include).first()).toBeAttached();
    builder = builder.include(include);
  }
  if (rules) builder = builder.withRules(rules);
  const { violations } = await builder.analyze();
  expect(
    violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length}x)`),
  ).toEqual([]);
}
