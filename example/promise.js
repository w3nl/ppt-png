var Converter = require('../js/convert.js');
var glob = require('glob');

require('array-helpers');

// options is optional
glob('input/test/*.ppt*', {}, convert);

/**
 * Convert the files.
 *
 * @param {object} error
 * @param {array} files
 */
function convert(error, files) {
    console.log('files: ', files.length);
    if(files) {
        new Converter({
            files:          files,
            output:         'output/test/',
            invert:         true,
            greyscale:      true,
            deletePdfFile:  true,
            outputType:     'png',
            logLevel:       2,
            fileNameFormat: '_vers_%d'
        }).wait().then(function(data) {
            console.log(data.failed, data.success.length, data.files.length, data.time);
            if(data.failed.length > 0) {
                convert(null, data.failed.multikey('file'));
            }
        });
    }
}
