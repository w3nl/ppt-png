import PptToPdfConverter from '@hckrnews/ppt2pdf';
import Pdf2PngConverter from '@hckrnews/pdf2png';
import {
    File,
    Converter
} from '@hckrnews/converter';
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

        this.files = files.map((file) => File.create({
            filePath: file
        }));
    }

    /**
     * Convert ppt files to pdf files.
     *
     * @return {array}
     */
    convert() {
        return this.files.map((file) => {
            const pptConverter = PptToPdfConverter.create({
                file:   file.path,
                output: this.output
            });

            pptConverter.convert();
            const pdfConverter = Pdf2PngConverter.create({
                file:   pptConverter.pdf,
                output: this.output
            });

            return pdfConverter.convert();
        });
    }

    /**
     * Create the converter
     *
     * @param {array} files
     *
     * @return {object}
     */
    static create({
        files,
        output
    }) {
        const converter = new Ppt2PngConverter();

        converter.setFiles(files);
        converter.setOutput(output);

        return converter;
    }
}

export default Ppt2PngConverter;
