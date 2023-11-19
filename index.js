const pup = require('puppeteer');

const url = 'https://alligareimoveis.com.br/';
const immobileTypes = ["Casa", "Apartamento"]; // Possible: Área,Apartamento,Casa,Casa comercial,Casa em Condomínio,
let c = 1;
const list = [];

(async () =>{
    const browser = await pup.launch({headless: false});
    const page = await browser.newPage();
    console.log("Inicio");

    await page.goto(url);
    console.log("Chegou na url");
    await page.waitForSelector('#search-minprice')

    await page.click('#select2-property-status-container');
    await page.click(`.select2-results__option ::-p-text("Aluguel")`);

    for (const type of immobileTypes) {
        await page.click('#Tipo'); //open select
        await page.click(`.select2-results__option ::-p-text(${type})`);
    }

    await Promise.all([
        page.waitForNavigation(),
        await page.click('#form-busca-avancada > div > div:nth-child(7) > div > button')
        
    ])
    
        const links = await page.$$eval('.property-thumb-info-image > a' , el => el.map(link => link.href)) // take itens links
        for(const link of links){ // search on links
            const buttonNext = '.pagination li:last-child';

                console.log("Produto: ", c);
                await page.goto(link);
                await page.waitForSelector('.page-top-in');

                const title = await page.$eval('.page-top-in' , element => element.innerText);
                const address = await page.$eval('div.col-sm-4 > div.row.form-group > div > ul', element => element.innerText);
                const description = await page.$eval('div.col-sm-8 > h2:nth-child(3)', element => element.innerText);
                const price = await page.$eval('span > span.label.price' , element => element.innerText);

                const obj = {
                    title,
                    address,
                    description,
                    price,
                    link
                };

                list.push(obj);
                
                c++;
            }
            console.log(list);

    await browser.close();
})()