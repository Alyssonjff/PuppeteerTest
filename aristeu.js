const pup = require('puppeteer');

const url = 'https://www.aristeurios.com.br';
const immobileTypes = ["Casa", "Apartamento"]; // Possible: Área,Apartamento,Casa
let c = 1;
const list = [];

(async () =>{
    const browser = await pup.launch({headless: false});
    const page = await browser.newPage();
    console.log("Inicio");
    
    await page.goto(url);
    console.log("Chegou na url");
    await page.waitForSelector('#label-locality')

    await page.click(`.nav.nav-tabs.nav-default ::-p-text("Alugar")`);

    for (const type of immobileTypes) {
        await page.click('#label-property-type'); //Open select
        await page.click(`#label-property-type ::-p-text(${type})`);
    }

    await Promise.all([
        page.waitForNavigation(),
        page.click('#clickSearch') 

    ])

    let buttonNext = await page.$('.btn.btn-md.btn-primary.btn-next');
    while( buttonNext ){
        buttonNext = await page.$('.btn.btn-md.btn-primary.btn-next');
        if(buttonNext){
            await buttonNext?.click();
            await page.waitForNavigation();
        }else{
            const links = await page.$$eval('div.listing-results .col-sm-12.col-lg-6.box-align:nth-child(1) .card.card-listing a' , el => el.map(link => link.href));
            for(const link of links){ //search on links
        
                console.log("Produto: ", c);
                await page.goto(link);
                await page.waitForSelector('.widget-listing-template02');
        
                const title = await page.$eval('span.first-line' , element => element.innerText);
                const price = await page.$eval('.knl_panels-list > .price > span:nth-child(2)' , element => element.innerText);
        
                const obj = {
                    title,
                    price,
                    link
                };
                
                list.push(obj);
        
                c++;
    
                await page.goBack();
            }
        }
    }

    console.log(list);

    await browser.close();
})();