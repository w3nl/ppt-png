import File from '../file.js';

describe('PPT-PNG file model test', () => {
    it('It should generate the file model', () => {
        const file = File.create({
            filePath: 'path'
        });

        expect(file.path).toBe('path');
    });

    it('It should throw an error if the pathpath isnt a string', () => {
        expect(() => {
            File.create({
                filePath: 42
            });
        }).toThrowError('File path should be a string');
    });
})
;
