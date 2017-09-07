var assert = require('assert');
var Converter = require('../js/convert.js');
var files = ['test/OPW 733 Tienduizend redenen.ppt'];

describe('ppt-png', function() {
    describe('normal', function() {
        it('should save without error', function() {
            new Converter({
                files:          files,
                output:         'output/test/',
                invert:         true,
                greyscale:      true,
                deletePdfFile:  false,
                outputType:     'jpg',
                logLevel:       3,
                fileNameFormat: '_vers_%d',
                callback:       function(data) {
                    if(data.failed.length > 0 || data.success.length < 1) {
                        done(data.failed);
                    } else {
                        done();
                    }
                }
            }).run();
        });
    });

    describe('promise', function() {
        it('should save without error', function() {
            new Converter({
                files:          files,
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
                    if(data.failed.length > 0 || data.success.length < 1) {
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

    describe('promise', function() {
        it('should save without error', function() {
            new Converter({
                files:          ['x.ppt'],
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
                    if(data.failed.length > 0 || data.success.length < 1) {
                        done();
                    } else {
                        done('error');
                    }
                })
                .catch(function(error) {
                    done(error);
                });
        });
    });
});
