var {
    Ppt2PngConverter
} = require('../dist/converter.js');
var {
    fileExists
} = require('@hckrnews/converter');


const converter = Ppt2PngConverter.create({
    files:  ['test/OPW 733 Tienduizend redenen.ppt'],
    output: 'output/'
});


const result = converter.convert();

console.log({
    exists: fileExists('output/OPW 733 Tienduizend redenen.pdf'),
    result
});
