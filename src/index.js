import { Command } from 'commander';
import fs from 'fs';
import path from 'path';

import { initializeDB } from './dbScript.js';


import { closePuppetter } from './puppeteer.js';

initializeDB();

const program = new Command();
program
  .name('exec immobile crawler')
  .description('Fetch new immobiles')
  .version('1.0.0');
program.option('-i, --immobile <value>', 'immobile to run');
program.parse();

const options = program.opts();

const folderPath = './src/immobiles';

const immobilesPromisses = fs
  .readdirSync(folderPath)
  .filter((file) => {
    if (options.immobile) {
      return file === options.immobile + '.js';
    }

    return path.extname(file) === '.js';
  })
  .map(async (file) => {
    const { default: module } = await import('./immobiles/' + file);
    if (typeof module === 'function') {
      try {
        await module();
      } catch (error) {
        console.log(`Error on file ${file}`)
        console.log(error);
      }
    }
  });

await Promise.allSettled(immobilesPromisses).finally(closePuppetter);
