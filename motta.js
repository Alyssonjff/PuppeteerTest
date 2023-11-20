const pup = require('puppeteer');

const url = 'https://www.imobiliariamotta.com.br/venda/imoveis/todas-as-cidades/todos-os-bairros/0-quartos/0-suite-ou-mais/0-vaga/0-banheiro-ou-mais/todos-os-condominios?valorminimo=0&valormaximo=0&pagina=1';
const immobileTypes = ["4", "2"]; // Possible: Área,Apartamento(2),Casa
let c = 1;
const list = [];

(async () =>{
    const browser = await pup.launch({headless: false});
    const page = await browser.newPage();
    console.log("Inicio");

    await page.goto(url);
    console.log("Chegou na url");
    await page.waitForSelector('.sidebar-widget.responsiv.bg-busca');

    await page.click('.sidebar-widget.responsiv.bg-busca .btn-group');
    await page.click('.dropdown-menu.open .dropdown-menu.inner li:nth-child(2) a .text');

    for (const type of immobileTypes) {
        await page.click('.row:nth-child(2) > .col-sm-4.col-xs-12:nth-child(1)'); //Open select
        await page.waitForSelector('.row:nth-child(2) .col-sm-4.col-xs-12:nth-child(1) .dropdown-menu.inner:nth-child(2)');
        await page.click(`.row:nth-child(2) .col-sm-4.col-xs-12:nth-child(1) .dropdown-menu.inner:nth-child(2) li:nth-child(${type})`);
    }

    await Promise.all([
        page.waitForNavigation(),
        page.click('#form-busca-avancada > div > div:nth-child(7) > div > button') 

    ])

    let buttonNext = await page.$('.pagination li ::-p-text("»")');
    while( buttonNext ){
        const links = await page.$$eval('.corpo-imoveis > a' , el => el.map(link => link.href));
        for(const link of links){ //search on links
    
            console.log("Produto: ", c);
            await page.goto(link);
            await page.waitForSelector('.pull-left');
    
            const title = await page.$eval('.pull-left' , element => element.innerText);
            const description = await page.$eval('.properties-description.mb-40', element => element.innerText);
            const price = await page.$eval('div.pull-right > h3 > span' , element => element.innerText);
    
            const obj = {
                title,
                description,
                price,
                link
            };
            
            list.push(obj);
    
            c++;

            await page.goBack();
        }
        buttonNext = await page.$('.pagination li ::-p-text("»")');
        if(buttonNext){
            await buttonNext?.click();
            await page.waitForNavigation();
        }
    }

    console.log(list);

    await browser.close();
})();