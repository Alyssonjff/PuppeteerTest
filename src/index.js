import { Command } from 'commander';
import fs from 'fs';
import path from 'path';

import { closePuppetter } from './puppeteer.js';

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
      await module();
    }
  });

await Promise.all(immobilesPromisses).finally(closePuppetter);
