var assert = require('assert');
var Converter = require('../js/convert.js');

describe('ppt-png', function() {
    describe('normal', function() {
        it('should save without error', function() {
            new Converter({
                files:          ['test/OPW 733 Tienduizend redenen.ppt'],
                output:         'output/test/',
                invert:         true,
                greyscale:      true,
                deletePdfFile:  false,
                outputType:     'jpg',
                logLevel:       3,
                fileNameFormat: '_vers_%d',
                callback:       function(data) {
                    console.log(data.failed, data.success.length, data.files.length, data.time);
                }
            }).run();
        });
    });

    describe('promise', function() {
        it('should save without error', function() {
            new Converter({
                files:          ['test/OPW 733 Tienduizend redenen.ppt'],
                output:         'output/test/',
                invert:         true,
                greyscale:      true,
                deletePdfFile:  true,
                outputType:     'png',
                logLevel:       2,
                fileNameFormat: '_vers_%d'
            })
                .wait()
                .then(function(data) {
                    if(data.failed.length > 0) {
                        done(data.failed);
                    } else {
                        done();
                    }
                })
                .catch(function(error) {
                    done(error);
                });
        });
    });
});
