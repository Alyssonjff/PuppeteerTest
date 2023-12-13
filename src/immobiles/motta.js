import { startPuppetter } from '../puppeteer.js';

const immobileTypes = ['casa--apartamento']; // Possible: Área,Apartamento(2),Casa
let c = 1;
const list = [];

export default async function motta() {
  const url =`https://www.imobiliariamotta.com.br/aluguel/${immobileTypes}/todas-as-cidades/todos-os-bairros/0-quartos/0-suite-ou-mais/0-vaga/0-banheiro-ou-mais/todos-os-condominios?valorminimo=0&valormaximo=0&pagina=1`;
  const page = await startPuppetter(url);
  
  console.log('Chegou na url');
  await page.waitForSelector('.sidebar-widget.responsiv.bg-busca');
  
  let buttonNext = 1;
  while (buttonNext) {
    buttonNext = await page.$('.pagination li ::-p-text("»")');
    const links = await page.$$eval('.property a',
     (el) =>  el.map((link) => link.href),
    );
    for (const link of links) {
      console.log('Produto: ', c);
      await page.goto(link);
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
      };

      list.push(obj);

      c++;

      await page.goBack();
    }
    if (buttonNext) {
      await buttonNext?.click();
      await page.waitForNavigation();
    }
  }

  console.log(list);

  await page.close();
}
