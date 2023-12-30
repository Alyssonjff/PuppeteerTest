import { insertProperties } from '../dbScript.js';
import { startPuppetter } from '../puppeteer.js';

const immobileTypes = ['casa--apartamento']; // Possible: Área,Apartamento(2),Casa
const properties = [];
const SITE_ID = 3;

export default async function motta() {
  const url =`https://www.imobiliariamotta.com.br/aluguel/${immobileTypes}/todas-as-cidades/todos-os-bairros/0-quartos/0-suite-ou-mais/0-vaga/0-banheiro-ou-mais/todos-os-condominios?valorminimo=0&valormaximo=0&pagina=1`;
  const page = await startPuppetter(url);
  
  await page.waitForSelector('.sidebar-widget.responsiv.bg-busca');
  
  let buttonNext = 1;
  while (buttonNext) {
    console.log('Entrou no while')
    buttonNext = await page.$('.pagination li ::-p-text("»")');
    const links = await page.$$eval('.property a',
     (el) =>  el.map((link) => link.href),
    );
    for (const link of links) {
      await page.waitForSelector('#app-filter')
      await page.goto(link, {delay: 1000});
      await page.waitForSelector('.pull-left');

      const title = await page.$eval(
        '.pull-left',
        (element) => element.innerText,
      );
      const description = await page.$eval(
        '.properties-description.mb-40',
        (element) => element.innerText,
      );
      const price = await page.$eval(
        'div.pull-right > h3 > span',
        (element) => element.innerText,
      );

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
    if (buttonNext) {
      await buttonNext?.click();
      await page.waitForNavigation();
    }
  }
  insertProperties(properties);

  await page.close();
}