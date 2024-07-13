import {
    Ppt2PngConverter
} from '../src/converter.js';
import {
    fileExists
} from '@hckrnews/converter';


const converter = Ppt2PngConverter.create({
    files:  ['test/OPW 733 Tienduizend redenen.ppt'],
    output: 'output/',
    density:         300,
    quality:         100,
});


const result = converter.convert();

console.log({
    exists: fileExists('output/OPW 733 Tienduizend redenen.pdf'),
    result
});
