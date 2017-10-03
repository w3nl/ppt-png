var assert = require('assert');
var Converter = require('../js/convert.js');
const fs = require('fs');

describe('ppt-png', function() {
    describe('add files', function() {
        it('Test the addFiles function.', function(done) {
            var convertTest = new Converter({
                output:         'output/test/',
                invert:         true,
                greyscale:      true,
                deletePdfFile:  false,
                outputType:     'png',
                logLevel:       2,
                fileNameFormat: '_vers_%d'
            });

            convertTest.addFiles(['test/OPW 733 Tienduizend redenen.ppt']);

            if(convertTest.files.length > 0) {
                done();
            } else {
                done('error');
            }
        });
    });

    describe('reset failed', function() {
        it('Test the resetFailed function.', function(done) {
            var convertTest = new Converter({
                output:         'output/test/',
                invert:         true,
                greyscale:      true,
                deletePdfFile:  false,
                outputType:     'png',
                logLevel:       2,
                fileNameFormat: '_vers_%d'
            });

            convertTest.failed = [{
                file: 'test/OPW 733 Tienduizend redenen.ppt'
            }];
            convertTest.resetFailed();

            if(convertTest.failed.length < 1 && convertTest.files.length == 1) {
                done();
            } else {
                done('error');
            }
        });
    });

    describe('fail', function() {
        it('Test if the fail function works.', function(done) {
            var convertTest = new Converter({
                output:         'output/test/',
                invert:         true,
                greyscale:      true,
                deletePdfFile:  false,
                outputType:     'png',
                logLevel:       3,
                fileNameFormat: '_vers_%d'
            });

            convertTest
                .wait()
                .then(function(data) {
                    convertTest.fail('test');
                    if(data.failed.length > 0) {
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

    describe('process page', function() {
        it('Check if the process page to png works.', function(done) {
            var convertTest = new Converter({
                output:         'output/test/',
                invert:         true,
                greyscale:      true,
                deletePdfFile:  false,
                outputType:     'png',
                logLevel:       3,
                fileNameFormat: '_vers_%d'
            });

            convertTest.processPage('test/OPW 733 Tienduizend redenen.ppt', true, null);

            convertTest.wait()
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

    describe('convert', function() {
        it('Check if the convert fail works.', function(done) {
            var convertTest = new Converter({
                output:         'output/test/',
                invert:         true,
                greyscale:      true,
                deletePdfFile:  true,
                outputType:     'png',
                logLevel:       3,
                fileNameFormat: '_vers_%d'
            });

            console.log(convertTest.convert());
            if(convertTest.convert()) {
                done('error');
            } else {
                done();
            }
        });
    });
});
