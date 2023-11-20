const pup = require('puppeteer');

const url = 'https://www.imobiliariapedraforte.com.br';
const immobileTypes = ["3", "2"]; // Possible: Apartamento(2) ,Casa(3)
let c = 1;
const list = [];

(async () =>{
    const browser = await pup.launch({headless: false});
    const page = await browser.newPage();
    console.log("Inicio");

    await page.goto(url);
    console.log("Chegou na url");
    await page.waitForSelector('#label-locality');

    await page.click(`ul.nav.nav-tabs.nav-default > li:nth-child(2)`);

    for (const type of immobileTypes) {
        await page.click('#label-property-type'); //Open select
        await page.click(`#label-property-type > option:nth-child(${type})`);
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
            const links = await page.$$eval('.card.card-listing > a' , el => el.map(link => link.href));
            for(const link of links){ //search on links
        
                console.log("Produto: ", c);
                await page.goto(link);
                await page.waitForSelector('span.first-line');
        
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