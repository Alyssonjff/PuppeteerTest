import { startPuppetter } from '../puppeteer.js';

const immobileTypes = ['casa+apartamento'];
const properties = [];
const SITE_ID = 2;

export default async function aristeu() {
  const url = `https://www.aristeurios.com.br/imoveis/para-alugar/${immobileTypes}`;
  const page = await startPuppetter(url);
  let buttonNext = 1;
  while (buttonNext) {
    buttonNext = await page.$('.btn.btn-md.btn-primary.btn-next');
    if (buttonNext) {
      await buttonNext?.click();
      await page.waitForNavigation();
    } else {
      const links = await page.$$eval('.listing-results .col-sm-12 .card > a', (el) => el.map((link) => link.href),);
      for (const link of links) {
        await page.goto(link);
        await page.waitForSelector('.top-listing');

        const title = await page.$eval('span.first-line', (element) => element.innerText);
        const price = await page.$eval('.knl_panels-list span:nth-child(2)', (element) => element.innerText);

        const obj = {
          title,
          price,
          link,
          SITE_ID,
        };

        properties.push(obj);
      }
    }
  }
  await page.close();

  return properties;
}
