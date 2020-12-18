import Converter from '../converter.js';
import {
    fileExists
} from '../fs.js';

describe('PPT-PNG converter test', () => {
    it('It should generate the converter', () => {
        const converter = Converter.create({
            files:  ['test/OPW 733 Tienduizend redenen.ppt'],
            output: 'output/'
        });

        expect(converter.files[0].path).toBe('test/OPW 733 Tienduizend redenen.ppt');
        expect(converter.files.length).toBe(1);
    });

    it('It should generate the converter', () => {
        const converter = Converter.create({
            files:  ['test/OPW 733 Tienduizend redenen.ppt'],
            output: 'output/'
        });

        converter.convertPptToPdf();

        expect(fileExists('output/OPW 733 Tienduizend redenen.pdf')).toBe(true);
    });

    it('It should throw an error if the files isnt an array', () => {
        expect(() => {
            Converter.create({
                files: 42
            });
        }).toThrowError('Files should be a array');
    });

    it('It should throw an error if the output isnt a string', () => {
        expect(() => {
            Converter.create({
                files:  ['test/OPW 733 Tienduizend redenen.ppt'],
                output: 42
            });
        }).toThrowError('Output should be a string');
    });

    it('It should throw an error if the output folder doesnt exists', () => {
        expect(() => {
            Converter.create({
                files:  ['test/OPW 733 Tienduizend redenen.ppt'],
                output: 'unknownfolder/'
            });
        }).toThrowError('Output folder doesnt exists');
    });

    it('It should throw an error if the output folder doesnt exists', () => {
        expect(() => {
            Converter.create({
                files:  ['test/OPW 733 Tienduizend redenen.ppt'],
                output: 'test/OPW 733 Tienduizend redenen.ppt'
            });
        }).toThrowError('Output folder doesnt exists');
    });
});
