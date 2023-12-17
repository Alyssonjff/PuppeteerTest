import { startPuppetter } from '../puppeteer.js';

const immobileTypes = ['casa', 'apartamento'];
const list = [];

export default async function pousoAlegre() {
  for (const type of immobileTypes) {
    const url = `https://pousoalegreimoveis.com.br/alugar/${type}`;
    const page = await startPuppetter(url);
    console.log('Chegou na url');
    await page.waitForSelector('.sc-lrgvkf-1');
      
    let buttonNext = 1;
    while (buttonNext) {
      const links = await page.$$eval('.src__Box-sc-1sbtrzs-0.src__Flex-sc-1sbtrzs-1.sc-1rvsmwh-0 div a', (el) =>
      el.map((link) => link.href),
      );
      for (const link of links) {
        await page.goto(link);
        await page.waitForSelector('.sc-bn22ww-0');
        
        const title = await page.$eval('.sc-1he91nm-2',(element) => element.innerText,);
        const address = await page.$eval('.sc-1he91nm-3',(element) => element.innerText,);
        const price = await page.$eval('span.sc-1san5b5-3',(element) => element.innerText,);
                  
        const obj = {
          title,
          address,
          price,
          link,
        };
                  
        list.push(obj);          
                  
        await page.goBack();
      }
      buttonNext = await page.$('.pagination li ::-p-text("PRÓXIMO")');
      if (buttonNext) {
        await buttonNext?.click();
        await page.waitForNavigation();
      }
    }
  }           
  console.log(list);          
  await page.close();
}      