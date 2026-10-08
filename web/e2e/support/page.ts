import type { Locator, Page } from "@playwright/test";

/** Abre a página e espera as fontes e as imagens, para as medidas não mudarem depois. */
export async function gotoReady(page: Page, path = "/") {
  await page.goto(path);
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  await page.waitForFunction(() =>
    [...document.images].every(
      (image) => image.complete && image.naturalWidth > 0,
    ),
  );
}

/** Devolve a cor computada de um token, por exemplo "--color-bg" → "rgb(17, 17, 17)". */
export async function resolveColor(page: Page, token: string) {
  return page.evaluate((name) => {
    const probe = document.createElement("span");
    probe.style.color = `var(${name})`;
    document.body.append(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  }, token);
}

/** Lê a caixa do elemento até duas leituras seguidas darem o mesmo resultado. */
export async function stableBox(locator: Locator) {
  const page = locator.page();
  const nextFrame = () =>
    page.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    );
  let previous = await locator.boundingBox();
  for (let attempt = 0; attempt < 20; attempt++) {
    await nextFrame();
    const current = await locator.boundingBox();
    if (
      previous &&
      current &&
      previous.x === current.x &&
      previous.y === current.y &&
      previous.width === current.width &&
      previous.height === current.height
    ) {
      return current;
    }
    previous = current;
  }
  throw new Error("A posição do elemento não estabilizou.");
}

/** Nome do elemento com foco: aria-label, depois o texto, depois o alt da imagem de dentro. */
export async function focusedName(page: Page) {
  return page.evaluate(() => {
    const element = document.activeElement;
    if (!element || element === document.body) return "";
    const label = element.getAttribute("aria-label");
    if (label) return label;
    const text = element.textContent?.trim();
    if (text) return text;
    return element.querySelector("img")?.getAttribute("alt") ?? "";
  });
}
