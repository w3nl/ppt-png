import {
    fileExists
} from './fs.js';


/**
 * File model
 */
class File {
    /**
     * Define the path
     */
    constructor() {
        this.path = null;
    }

    /**
     * Set the path
     *
     * @param {string} path
     */
    setPath(path) {
        if (!path || path.constructor !== String) {
            throw new Error('File path should be a string');
        }

        if (!fileExists(path)) {
            throw new Error('File path doesnt exists');
        }

        this.path = path;
    }

    /**
     * Create a file model
     *
     * @param {string} filePath
     *
     * @return {object}
     */
    static create({
        filePath
    }) {
        const file = new File();

        file.setPath(filePath);

        return file;
    }
}

export default File;
