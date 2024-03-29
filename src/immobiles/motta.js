import { startPuppetter } from '../puppeteer.js';

const properties = [];
const SITE_ID = 3;
let room = ['3','4'];
export default async function motta() {
  const page = await startPuppetter();
  for (let rooms of room){
    const url = `https://www.imobiliariamotta.com.br/aluguel/casa--apartamento/todas-as-cidades/todos-os-bairros/${rooms}-quartos/0-suite-ou-mais/0-vaga/0-banheiro-ou-mais/todos-os-condominios?valorminimo=0&valormaximo=0&pagina=1`;
    await page.goto(url);
  await page.waitForSelector('.property a');
  page.on('dialog', async (dialog) => {
    await dialog.accept();
  });

  let buttonNext;
    let previousLink = await page.url();
    let currentLink = await page.url();
  do {
        previousLink = await page.url();
    const links = await page.$$eval('.property > a', (el) => el.map((link) => link.href));
    for (const link of links) {
      await page.waitForSelector('#app-filter');
      await page.goto(link);
      await page.waitForSelector('.pull-left');

      const title = await page.$eval('.pull-left', (element) => element.innerText);
      const description = await page.$eval('.properties-description.mb-40', (element) => element.innerText);
      const price = await page.$eval('div.pull-right > h3 > span', (element) => element.innerText);

      const obj = {
        title,
        description,
        price,
        link,
        SITE_ID,
      };

      properties.push(obj);

      await page.goBack();
    }

        buttonNext = await page.$('#paginacao > ul:last-child > li:last-child a');
    if (buttonNext) {
      await buttonNext?.click();
        }
        currentLink = await page.url();
      } while (previousLink !== currentLink); 
    }


  await page.close();

  return properties;
}
