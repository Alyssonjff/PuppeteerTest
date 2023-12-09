const pup = require('puppeteer');

const immobileTypes = ["apartamento", "casa"]; // Possible: Apartamento(2) ,Casa(3)
let c = 1;
const list = [];

(async () =>{
    const browser = await pup.launch({headless: false});
    const page = await browser.newPage();
    console.log("Inicio");
    
    for (const type of immobileTypes) {
        const url = `https://www.imobiliariapedraforte.com.br/imoveis/para-alugar/${type}`;
        await page.goto(url);
        console.log("Chegou na url");
        await page.waitForSelector('#label-locality');

        let buttonNext = 1;
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
                    
                    const obj = {
                        title,
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