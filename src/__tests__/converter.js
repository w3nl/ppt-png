import Converter from '../converter.js';

describe('PPT-PNG converter test', () => {
    it('It should generate the converter', () => {
        const converter = Converter.create({
            files: ['path']
        });

        expect(converter.files[0].path).toBe('path');
        expect(converter.files.length).toBe(1);
    });

    it('It should throw an error if the files isnt an array', () => {
        expect(() => {
            Converter.create({
                files: 42
            });
        }).toThrowError('Files should be a array');
    });
})
;
