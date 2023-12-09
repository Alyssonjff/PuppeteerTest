import puppeteer from 'puppeteer';

let browser = await puppeteer.launch({
  headless: false,
  defaultViewport: null,
});
export async function startPuppetter(url) {
  const page = await browser.newPage();

  if (url) {
    await page.goto(url);
  }

  return page;
}

export async function closePuppetter() {
  await browser.close();
}
