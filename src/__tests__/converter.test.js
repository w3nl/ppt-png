import test from 'node:test';
import assert from 'assert';
import Converter from '../converter.js';
import {
    fileExists
} from '@hckrnews/converter';

test('PPT-PNG converter test', async (t) => {
   await t.test('It should generate the converter', () => {
        const converter = Converter.create({
            files:  ['test/OPW 733 Tienduizend redenen.ppt'],
            output: 'output/'
        });

        assert.strictEqual(converter.files[0].path, 'test/OPW 733 Tienduizend redenen.ppt');
        assert.strictEqual(converter.files.length, 1);
    });

   await t.test('It should generate the converter', () => {
        const converter = Converter.create({
            files:  ['test/OPW 733 Tienduizend redenen.ppt'],
            output: 'output/'
        });

        const result = converter.convert();

        assert.strictEqual(result[0].file.path, 'output/OPW 733 Tienduizend redenen.pdf');
        assert.strictEqual(fileExists('output/OPW 733 Tienduizend redenen.pdf'), true);
    });

   await t.test('It should throw an error if the files isnt an array', () => {
        try {
            Converter.create({
                files: 42
            });
        } catch (error) {
            assert.strictEqual(error.message, 'Files should be a array');
        }
    });

   await t.test('It should throw an error if the output isnt a string', () => {
        try {
            Converter.create({
                files:  ['test/OPW 733 Tienduizend redenen.ppt'],
                output: 42
            });
        } catch (error) {
            assert.strictEqual(error.message, 'Output should be a string');
        }
    });

   await t.test('It should throw an error if the output folder doesnt exists', () => {
        try {
            Converter.create({
                files:  ['test/OPW 733 Tienduizend redenen.ppt'],
                output: 'unknownfolder/'
            });
        } catch (error) {
            assert.strictEqual(error.message, 'Output folder doesnt exists');
        }
    });

   await t.test('It should throw an error if the output folder doesnt exists', () => {
        try {
            Converter.create({
                files:  ['test/OPW 733 Tienduizend redenen.ppt'],
                output: 'test/OPW 733 Tienduizend redenen.ppt'
            });
        } catch (error) {
            assert.strictEqual(error.message, 'Output folder doesnt exists');
        }
    });
});
