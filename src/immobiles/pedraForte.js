import { startPuppetter } from '../puppeteer.js';

const immobileTypes = ['casa+apartamento']; // Possible: Apartamento(2) ,Casa(3)
const properties = [];
const SITE_ID = 6;

export default async function pedraForte() {
  const page = await startPuppetter();

  const url = `https://www.imobiliariapedraforte.com.br/imoveis/para-alugar/${immobileTypes}`;
  await page.goto(url);
  await page.waitForSelector('#label-locality');

  let buttonNext = 1;
  while (buttonNext) {
    buttonNext = await page.$('.btn.btn-md.btn-primary.btn-next');
    if (buttonNext) {
      await buttonNext?.click();
      await page.waitForNavigation();
    } else {
      const links = await page.$$eval('.card.card-listing > a', (el) =>
        el.map((link) => link.href),
      );
      for (const link of links) {
        //search on links
        await page.goto(link);
        await page.waitForSelector('span.first-line');

        const title = await page.$eval(
          'span.first-line',
          (element) => element.innerText,
        );
        const price = await page.$eval(
          '.knl_panels-list:first-child span:nth-child(2)',
          (element) => element.innerText,
        );

        const obj = {
          title,
          link,
          price,
          SITE_ID,
        };

        properties.push(obj);
        await page.goBack();
      }
    }
  }

  await page.close();
  return properties;
}
