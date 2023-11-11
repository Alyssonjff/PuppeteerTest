const { links } = require('express/lib/response');
const pup = require('puppeteer');

const url = 'https://alligareimoveis.com.br/';
const searchFor = "Casa";
const tipoDeImovel = "Apartamento"; // Possiveis: Área,Apartamento,Casa,Casa comercial,Casa em Condomínio,
const Cidade = "";
const ValorMin = "5000000";  //Colocar todos os digitos (ate centavos)
const ValorMax = "15000000"; //Colocar todos os digitos (ate centavos)
let c = 1;

(async () =>{
    const browser = await pup.launch({headless: false});
    const page = await browser.newPage();
    console.log("Inicio");

    await page.goto(url);
    console.log("Chegou na url");
    await page.waitForSelector('#search-minprice')

    await page.click('#Tipo'); //Abre a seleção de opções
    await page.click('select[id="Tipo"]' , 'Apartamento'); // colocar ${tipoDeImovel}
   // await page.click('div[');

    await page.click('#location'); //Abre a selecao de cidades
    await page.click('#location');

    await page.click('#lista-bairros'); //Abre a selecao de Bairros
    await page.click('#lista-bairros');

    await page.click('#search-minprice');
    await page.type('#search-minprice', ValorMin); //Seta o valor minimo

    await page.click('#search-maxprice');
    await page.type('#search-maxprice', ValorMax); //Seta o valor Maximo

    await Promise.all([
        page.waitForNavigation(),
        await page.click('#form-busca-avancada > div > div:nth-child(7) > div > button')  //Enconntrar Forma de clicar no Pesquisar

    ])

    const links = await page.$$eval('.property-thumb-info-image > a' , el => el.map(link => link.href)) // obtem os links dos itens

    for(const link of links){ // navega pelos links e absorve os dados
        await page.goto(link);
        await page.waitForSelector('.page-top-in');
        
        const title = await page.$eval('.page-top-in' , element => element.innerText);
        const adress = await page.$eval('div.col-sm-4 > div.row.form-group > div > ul', element => element.innerText);
        const Description = await page.$eval('div.col-sm-8 > h2:nth-child(3)', element => element.innerText);
        //const price = await page.$eval('.nome da classe' , element => element.innerText); / site n tem preco no html

        const obj = {title,adress,Description,link};
        console.log(obj);

        c++;
    }

    //await page.waitForTimeout(5000);  -- n funciona aparentemente
    await browser.close();
})();