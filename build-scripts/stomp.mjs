import Builder from 'stomp';
import { WEBROOT } from './output.mjs';
import { join } from 'node:path';

const st_output = join(WEBROOT, 'stomp');

const builder = new Builder(st_output);

console.log('Bundling Stomp...');
await builder.build();
console.log('Bundle created');
