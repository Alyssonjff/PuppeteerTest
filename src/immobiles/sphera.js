import { startPuppetter } from '../puppeteer.js';

const immobileTypes = ['apartamento+casa'];
const properties = [];
const SITE_ID = 8;

export default async function sphera() {
  const url = `https://www.spheraimoveis.com.br/imoveis/para-alugar/${immobileTypes}?finalidade=residencial`;
  const page = await startPuppetter(url);

  let buttonNext = 1;

  while (buttonNext) {
    buttonNext = await page.$('.btn.btn-md.btn-primary.btn-next');

    if (buttonNext) {
      await buttonNext?.click();
      await page.waitForNavigation();
    } else {
      const links = await page.$$eval(
        '.digital-result.digital-result__grid > a',
        (el) => el.map((link) => link.href),
      );
      for (const link of links) {
        await page.goto(link);
        await page.waitForSelector('.overflow-image-gallery');

        const title = await page.$eval(
          '.first-line',
          (element) => element.innerText,
        );
        const price = await page.$eval(
          '.knl_panels-list p',
          (element) => element.innerText,
        );

        const obj = {
          title,
          link,
          price,
          SITE_ID,
        };

        properties.push(obj);
      }
    }
  }
  await page.close();

  return properties;
}