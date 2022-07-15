import { File, Converter } from '@hckrnews/converter';
import pdf2png from './pdf2png.js';
import ppt2pdf from './ppt2pdf.js';
/**
 * Converter
 */
class Ppt2PngConverter extends Converter {
    /**
     * Define the files array
     */
    constructor() {
        super();
        this.files = [];
    }

    /**
     * Set the files
     *
     * @param {array} files
     */
    setFiles(files) {
        if (!files || files.constructor !== Array) {
            throw new Error('Files should be a array');
        }

        this.files = files.map((file) =>
            File.create({
                filePath: file,
            })
        );
    }

    /**
     * Convert ppt files to pdf files.
     *
     * @return {array}
     */
    convert() {
        return this.files.map((file) => {
            const pdf = ppt2pdf({
                file,
                output: this.output,
            });

            return pdf2png({
                file: pdf,
                output: this.output,
            });
        });
    }

    /**
     * Create the converter
     *
     * @param {array} files
     *
     * @return {object}
     */
    static create({ files, output }) {
        const converter = new Ppt2PngConverter();

        converter.setFiles(files);
        converter.setOutput(output);

        return converter;
    }
}

export default Ppt2PngConverter;
export { Ppt2PngConverter, pdf2png, ppt2pdf };
