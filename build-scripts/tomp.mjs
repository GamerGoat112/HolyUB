import Builder from 'tomp';
import { webroot } from './output.mjs';
import { join } from 'node:path';

const builder = new Builder(join(webroot, 'tomp'));

console.log('Bundling sysce/TOMP...');
await builder.build();
console.log('Bundle created');
