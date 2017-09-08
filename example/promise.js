var Converter = require('../js/convert.js');
var glob = require('glob');

var convertTest = new Converter({
    output:         'output/test/',
    invert:         true,
    greyscale:      true,
    deletePdfFile:  true,
    outputType:     'png',
    logLevel:       2,
    fileNameFormat: '_vers_%d'
});

require('array-helpers');

// options is optional
glob('input/test/*.ppt*', {}, convertFromGlob);

function convertFromGlob(error, files) {
    convertTest.addFiles(files);
    convert();
}

/**
 * Convert the files.
 *
 * @param {object} error
 * @param {array} files
 */
function convert() {
    console.log('files: ', convertTest.files.length);
    if(convertTest.files) {
        convertTest.wait().then(function(data) {
            console.log(data.failed, data.success.length, data.files.length, data.time);
            if(data.failed.length > 0) {
                convertTest.resetFailed();
                convert();
            }
        });
    }
}
