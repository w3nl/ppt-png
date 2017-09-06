var Converter = require('../js/convert.js');
var glob = require('glob');

// options is optional
glob('input/test/*.ppt', {}, function(er, files) {
    console.log('files: ', files);
    if(files) {
        new Converter({
            files:         files,
            output:        'output/test/',
            invert:        true,
            deletePdfFile: true,
            outputType:    'png',
            logLevel:      2
        }).wait().then(function(data) {
            console.log(data.songs, data.files, data.time);
        });
    }
});
