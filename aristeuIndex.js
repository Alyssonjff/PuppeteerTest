const pup = require('puppeteer');

const url = 'https://www.tadeuimoveis.imb.br/';
const immobileTypes = [4, 5]; // Possible: Apartamento(4),Casa(5)
let c = 1;
const list = [];

(async () =>{
    const browser = await pup.launch({headless: false});
    const page = await browser.newPage();
    console.log("Inicio");

    await page.goto(url);
    console.log("Chegou na url");
    await page.waitForSelector('#label-locality');

    await page.click('.kdls-select__container');
    await page.click(`.kdls-select__option ::-p-text("Alugar")`);
    await page.click('.search-home');

    for (const type of immobileTypes) {
        await page.click('.kdls-select__select.kdls-select__select--left-icon'); //Open select
        await page.click(`.kdls-select__menu.kdls-select__menu--open > li:nth-child(${type})`);
        await page.click('.header-container');
    }

    await Promise.all([
        page.waitForNavigation(),
        await page.click('section > form > button') 

    ])

    const links = await page.$$eval('.digital-result.digital-result__grid > a' , el => el.map(link => link.href));
    for(const link of links){ //search on links

        console.log("Produto: ", c);
        await page.goto(link);
        await page.waitForSelector('.overflow-image-gallery');

        const title = await page.$eval('.box-description' , element => element.innerText);

        const obj = {
            title,
            link
        };

        list.push(obj);

        c++;
    }

    console.log(list);

    await browser.close();
})();