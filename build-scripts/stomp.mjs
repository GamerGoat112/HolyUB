import Builder from 'stomp';
import { webroot } from './output.mjs';
import { join } from 'node:path';

const st_output = join(webroot, 'stomp');

const builder = new Builder(st_output);

console.log('Bundling Stomp...');
await builder.build();
console.log('Bundle created');
