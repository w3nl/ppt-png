var Converter = require('../js/convert.js');
var glob = require('glob');

// options is optional
glob('input/opwekking/*.ppt', {}, function(er, files) {
    console.log('files: ', files);
    if(files) {
        new Converter({
            files:  files,
            output: 'output/opwekking/'
        });
    }
});
