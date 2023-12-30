import fs from 'fs';
import Database from 'better-sqlite3';

let db;
export function initializeDB(){   
    db = new Database('database.db');
    db.pragma('journal_mode = WAL');

    const createTable = fs.readFileSync('./src/create-db.sql', 'utf8');
    db.exec(createTable);
    
    const alligar = db.prepare("SELECT * FROM site WHERE name = 'Alligar'").get();
    if (!alligar) {
        const insert = db.prepare('INSERT INTO site (name) VALUES (@name)');
        const insertMany = db.transaction((sites) => {
            for (const site of sites) {
                insert.run(site)
            }
        });
        
        insertMany([
            { name: 'Alligar'},
            { name: 'Aristeu'},
            { name: 'Motta'},
            { name: 'Nadir'},
            { name: 'Pantanal'},
            { name: 'PedraForte'},
            { name: 'PousoAlegre'},
            { name: 'Sphera'},
            { name: 'Tadeu'},
        ]);
    }
}

const nullColumns = ['batata','description','price'];
const insert = db.prepare(`INSERT INTO 
properties (link, title, address, description, price, site_id) 
VALUES     (@link, @title, @batata, @description, @price, @SITE_ID)`);
export const insertProperties = db.transaction((properties) => {
    for(const property of properties) {
        try {
            nullColumns.forEach((column) => {
                if(!property[column]){
                    property[column] = null;
                }
            })
            insert.run(property)
        } catch (error) {
            console.log(error);
        }
    }
})