import { startPuppetter } from '../puppeteer.js';

const immobileTypes = ["apartamento+casa"];
const list = [];

export default async function tadeu() {
  const url = `https://www.tadeuimoveis.imb.br/imoveis/para-alugar/${immobileTypes}?finalidade=residencial`;
  const page = await startPuppetter(url);

  let buttonNext = 1;

  while (buttonNext) {
    buttonNext = await page.$('.digital-pagination ::-p-text("Ver mais")');
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
          '.box-description',
          (element) => element.innerText,
        );

        const obj = {
          title,
          link,
        };

        list.push(obj);
      }
    }
  }

  console.log(list);

  await page.close();
}