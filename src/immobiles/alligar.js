import { startPuppetter } from '../puppeteer.js';

const url = 'https://alligareimoveis.com.br';
const immobileTypes = ['Casa', 'Apartamento']; // Possible: Área,Apartamento,Casa
const properties = [];
const SITE_ID = 1;

export default async function alligar() {
  const page = await startPuppetter(url);

  await page.waitForSelector('#search-minprice');

  await page.click('#select2-property-status-container');
  await page.click(`.select2-results__option ::-p-text("Aluguel")`);

  for (const type of immobileTypes) {
    await page.click('#Tipo'); //Open select
    await page.click(`.select2-results__option ::-p-text(${type})`);
  }

  await Promise.all([
    page.waitForNavigation(),
    page.click('#form-busca-avancada > div > div:nth-child(7) > div > button'),
  ]);

  let buttonNext = await page.$('.pagination li ::-p-text("PRÓXIMO")');
  while (buttonNext) {
    const links = await page.$$eval('.property-thumb-info-image > a', (el) =>
      el.map((link) => link.href),
    );
    for (const link of links) {
      //search on links

      await page.goto(link);
      await page.waitForSelector('.page-top-in');

      const title = await page.$eval(
        '.page-top-in',
        (element) => element.innerText,
      );
      const address = await page.$eval(
        'div.col-sm-4 > div.row.form-group > div > ul',
        (element) => element.innerText,
      );
      const description = await page.$eval(
        'div.col-sm-8 > h2:nth-child(3)',
        (element) => element.innerText,
      );
      const price = await page.$eval(
        'span > span.label.price',
        (element) => element.innerText,
      );

      const obj = {
        title,
        batata:address,
        description,
        price,
        link,
        SITE_ID,
      };

      properties.push(obj);

      await page.goBack();
    }
    buttonNext = await page.$('.pagination li ::-p-text("PRÓXIMO")');
    if (buttonNext) {
      await buttonNext?.click();
      await page.waitForNavigation();
    }
  }
  await page.close();

  return properties;
}
