import { resolve } from 'path';
import Builder from 'stomp';

const builder = new Builder(resolve('public/stomp'));

console.log('Bundling Stomp...');
await builder.build();
console.log('Bundle created');
