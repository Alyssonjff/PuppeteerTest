import { startPuppetter } from '../puppeteer.js';

const url = 'https://www.imobiliariapantanal.com.br';
const immobileTypes = [4, 5]; // Possible: Apartamento(4),Casa(5)
let c = 1;
const list = [];

export default async function pantanal() {
  const page = await startPuppetter(url);
  console.log('Chegou na url');
  await page.waitForSelector('#label-locality');

  await page.click('.kdls-select__container');
  await page.click(`.kdls-select__option ::-p-text("Alugar")`);
  await page.click('.digital-search__title-light');

  for (const type of immobileTypes) {
    await page.click(
      '.digital-search__field:nth-child(2) .kdls-select__container',
    ); //Open select
    await page.click(`.kdls-select__menu > li:nth-child(${type})`);
    await page.click('.digital-search__title-light');
  }

  await page.click('#closeCookie');
  const elementHandle = await page.$('#label-locality');
  await elementHandle.type('');
  await elementHandle.press('Enter');
  await page.waitForNavigation();

  let buttonNext = await page.$('.btn.btn-md.btn-primary.btn-next');

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
        //search on links

        console.log('Produto: ', c);
        await page.goto(link);
        await page.waitForSelector('.overflow-image-gallery');

        const title = await page.$eval(
          '.first-line',
          (element) => element.innerText,
        );

        const obj = {
          title,
          link,
        };

        list.push(obj);

        c++;
      }
    }
  }

  console.log(list);

  await page.close();
}
