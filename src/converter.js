import File from './file.js';
import {
    folderExists,
    getFileName
} from './fs.js';
import {
    execSync
} from 'child_process';
import path from 'path';

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
        this.pptToPdfConverter = 'libreoffice --headless --convert-to pdf --outdir';
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
     * Get the exec path
     *
     * @param {string} filePath
     *
     * @return {string}
     */
    getExecPath(filePath) {
        return this.pptToPdfConverter + ' \'' + this.output + '\' \'' + filePath + '\'';
    }

    /**
     * Get the pdf file path.
     *
     * @param {string} fileName
     *
     * @return {string}
     */
    getPdfFile(fileName) {
        return this.output + path.parse(fileName).name + '.pdf';
    }

    /**
     * Convert ppt files to pdf files.
     */
    convertPptToPdf() {
        this.files.forEach((file) => {
            const fileName = getFileName(file.path);
            const output = execSync(this.getExecPath(file.path));

            console.log({
                fileName,
                size: output.length,
                pdf:  this.getPdfFile(fileName)
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
