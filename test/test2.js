import Converter from '../src/converter.js';
import {
    fileExists
} from '@hckrnews/converter';


const converter = Converter.create({
    files:  ['test/OPW 733 Tienduizend redenen.ppt'],
    output: 'output/'
});


const result = converter.convertPptToPdf();

console.log({
    exists: fileExists('output/OPW 733 Tienduizend redenen.pdf'),
    result
});
