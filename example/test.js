var Converter = require('../js/convert.js');
var glob = require('glob');

// options is optional
glob('input/test/*.ppt*', {}, function(error, files) {
    console.log('files: ', files);
    if (files) {
        new Converter({
            files:           files,
            output:          'output/test/',
            invert:          true,
            greyscale:       true,
            deletePdfFile:   false,
            outputType:      'png',
            logLevel:        5,
            fileNameFormat:  '_vers_%d',
            documentConvert: 'libreoffice --headless --convert-to pdf --outdir',
            callback:        function(data) {
                console.log(data);
            }
        }).run();
    }
});
