import File from '../file.js';

describe('PPT-PNG file model test', () => {
    it('It should generate the file model', () => {
        const file = File.create({
            filePath: 'test/OPW 733 Tienduizend redenen.ppt'
        });

        expect(file.path).toBe('test/OPW 733 Tienduizend redenen.ppt');
    });

    it('It should throw an error if the pathpath doesnt exists', () => {
        expect(() => {
            File.create({
                filePath: '42'
            });
        }).toThrowError('File path doesnt exists');
    });

    it('It should throw an error if the pathpath isnt a string', () => {
        expect(() => {
            File.create({
                filePath: 42
            });
        }).toThrowError('File path should be a string');
    });

    it('It should throw an error if the pathpath isnt a string', () => {
        expect(() => {
            File.create({
                filePath: 'output/'
            });
        }).toThrowError('File path doesnt exists');
    });
});
