import File from './file.js';
import {
    folderExists
} from './fs.js';

/**
 * Converter
 */
class Converter {
    /**
     * Define the files array
     */
    constructor() {
        this.files = [];
        this.output = null;
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
     * Set the output path
     *
     * @param {string} output
     */
    setOutput(output) {
        if (!output || output.constructor !== String) {
            throw new Error('Output should be a string');
        }

        if (!folderExists(output)) {
            throw new Error('Output folder doesnt exists');
        }

        this.output = output;
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
        const converter = new Converter();

        converter.setFiles(files);
        converter.setOutput(output);

        return converter;
    }
}

export default Converter;

