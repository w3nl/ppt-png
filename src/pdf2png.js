import Pdf2PngConverter from '@hckrnews/pdf2png';

/**
 * @typedef {object} Converter
 * @property {any} file
 * @property {string} fileName
 * @property {Buffer} output
 */

/**
 * Convert a PDF file to a PNG file.
 * @param {object} params
 * @param {string} params.file
 * @param {string} params.output
 * @param {string} params.customConverter
 * @param {number} params.density
 * @param {number} params.quality
 * @returns {Converter}
 */
export default ({ file, output, density, quality }) => {
    const pdfConverter = Pdf2PngConverter.create({
        file,
        output,
        density,
        quality,
    });

    return pdfConverter.convert();
};
