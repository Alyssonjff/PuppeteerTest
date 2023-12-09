const pup = require('puppeteer');

const immobileTypes = ["apartamento", "apartamento-duplex" , "casa"]; // Possible: Área,Apartamento(),Casa()
let c = 1;
const list = [];

(async () =>{
    const browser = await pup.launch({headless: false});
    const page = await browser.newPage();
    console.log("Inicio");
    
    for (const type of immobileTypes) {
    const url = `https://www.nadirimoveis.com.br/imoveis/para-alugar/${type}?quartos=3+`;
    await page.goto(url);
    await page.waitForSelector('#label-locality')

        let buttonNext = 2;
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
                    await page.waitForSelector('div.listing-details');
                    
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
    }
        
        
    console.log(list);

    await browser.close();
})();