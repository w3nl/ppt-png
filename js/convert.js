const fs = require('fs');
const Jimp = require('jimp');
const pdf2image = require('pdf2image');
const unoconv = require('unoconv2');

require('array-helpers');

/**
 * PPT to Image converter.
 */
class Converter {
    /**
     * Constructor.
     *
     * @param {object} options
     */
    constructor(options) {
        this.files = options.files || [];
        this.filesDone = [];
        this.output = options.output;
        this.invert = options.invert || false;
        this.greyscale = options.greyscale || false;
        this.deletePdfFile = options.deletePdfFile || true;
        this.outputType = options.outputType || 'png';
        this.logLevel = options.logLevel || 1;
        this.callback = options.callback || null;
        this.fileNameFormat = options.fileNameFormat || '_page_%d',
        this.file = 0;
        this.start = Date.now();
        this.fileConvertTime = this.start;
        this.success = [];
        this.failed = [];
        this.ready = false;
        this.promise = false;
        this.resolve = null;
        this.reject = null;
        this.version = '0.1.8';
    }

    /**
     * With this function, you can use the promise function.
     *
     * @return {object}
     */
    wait() {
        var promise;

        this.promise = true;

        promise = new Promise(this.run.bind(this));

        return promise;
    }

    /**
     * Start the script.
     *
     * @param {object} resolve
     * @param {object} reject
     *
     * @return {object}
     */
    run(resolve, reject) {
        if (resolve && this.promise == true) {
            this.resolve = resolve;
        }

        if (reject && this.promise == true) {
            this.reject = reject;
        }

        this.next();

        return this;
    }

    /**
     * Called when the pdf to image failed (convertPDF).
     *
     * @param {object} error
     */
    fail(error) {
        if (this.logLevel >= 1) {
            console.error('Cannot convert: ' + this.currentFile);
        }

        this.failed.push({
            file:    this.currentFile,
            failure: 'convertPDF',
            error:   error
        });

        this.next();
    }

    /**
     * Add more files.
     *
     * @param {array} files
     *
     * @return {object}
     */
    addFiles(files) {
        this.files.push(...files);

        return this;
    }

    /**
     * Run again failed files.
     *
     * @return {object}
     */
    resetFailed() {
        if (this.logLevel >= 1) {
            console.error('Reset files: ' + this.failed.length);
        }

        this.files = this.failed.multikey('file');
        this.failed = [];

        return this;
    }

    /**
     * Get the next file.
     */
    next() {
        var totalTime = Date.now() - this.start;
        var fileTime = Date.now() - this.fileConvertTime;
        var response;

        this.fileConvertTime = Date.now();

        if (this.files.length < 1) {
            if (this.file > 0 && this.logLevel >= 1) {
                console.log('Total time: ' + totalTime + 'ms for ' + this.file + ' files');
                if (this.logLevel >= 3) {
                    console.log('Average: ' + (totalTime / this.file) + 'ms/file');
                }
            }

            if (this.logLevel >= 3) {
                console.log(this.success);
            }

            this.ready = true;
            response = {
                success: this.success,
                failed:  this.failed,
                files:   this.filesDone,
                time:    totalTime
            };

            if (this.promise == true) {
                this.resolve(response);
            }

            if (this.callback) {
                this.callback(response);
            }

            return;
        }

        this.file++;
        if (this.logLevel >= 1) {
            console.log('File: ' + this.file + ', time: ' + fileTime + ' ms, total time: ' + totalTime + 'ms');
            console.log('Average: ' + (totalTime / this.file) + 'ms/file');
        }

        this.currentFile = this.files.pop();
        this.filesDone.push(this.currentFile);

        this.convert(this.currentFile, this.file);
    }

    /**
     * Convert function.
     *
     * @param {string} file
     * @param {int} index
     */
    convert(file, index) {
        var fileName = null;
        var filePath = null;
        var numbers;

        if (!file) {
            return;
        } else if (typeof file == 'object') {
            fileName = file.originalname;
            filePath = file.path;
        } else {
            fileName = file.split('/').pop();
            filePath = file;
        }

        if(!fileName) {
            return;
        }

        if (this.logLevel >= 2) {
            console.log('Convert: ' + file);
        }

        numbers = fileName.match(/\d+/g);

        unoconv.convert(filePath, 'pdf', {}, this.convertedToPdf.bind(this, index, numbers));
    }

    /**
     * Convert PDF to Image.
     *
     * @param {int} index
     * @param {array} numbers
     * @param {object} error
     * @param {object} result
     *
     * @return {string}
     */
    convertedToPdf(index, numbers, error, result) {
        var pdfFile = this.output + index + '.pdf';
        var imageFile = this.output + (numbers ? numbers.join('_') : index);
        var converter = pdf2image.compileConverter({
            outputFormat: imageFile + this.fileNameFormat,
            outputType:   this.outputType
        });

        if (this.logLevel >= 2) {
            console.log('Converted to pdf');
        }

        if (error) {
            if (this.logLevel >= 1) {
                console.error('Error on converting to pdf');
                this.failed.push({
                    file:    this.currentFile,
                    failure: 'unoconv',
                    error:   error
                });
            }

            this.next();

            return;
        }

        // result is returned as a Buffer
        fs.writeFile(pdfFile, result);

        if (this.logLevel >= 2) {
            console.log('Pdf saved: ' + pdfFile);
        }

        // converts all the pages of the given pdf using the default options
        converter.convertPDF(pdfFile)
            .then(
                this.convertedToImage.bind(this)
            )
            .catch(
                this.fail.bind(this)
            );

        return pdfFile;
    }

    /**
     * Convert to image.
     *
     * @param {array} pageList
     */
    convertedToImage(pageList) {
        if (this.logLevel >= 2) {
            console.log('Converted to: ' + this.outputType);
        }

        if (this.invert || this.greyscale) {
            pageList.forEach(this.page.bind(this));
        }

        this.success.push(pageList);

        if (this.deletePdfFile) {
            this.deletePdf();
        }

        this.next();
    }

    /**
     * A page image.
     *
     * @param {object} element
     */
    page(element) {
        var file = element.path;

        Jimp.read(file, this.processPage.bind(this, file));
    }

    /**
     * Process page image.
     *
     * @param {string} file
     * @param {object} error
     * @param {object} image
     */
    processPage(file, error, image) {
        if (error) {
            if (this.logLevel >= 1) {
                console.error('Inverting page error', error);
                this.failed.push({
                    file:    this.currentFile,
                    failure: 'jimp',
                    error:   error
                });
            }

            return;
        }

        if(this.greyscale) {
            image.greyscale();
        }

        if(this.invert) {
            image.invert();
        }

        image.write(file);
    }

    /**
     * Delete a file.
     *
     * @param {string} file
     */
    deletePdf() {
        var file = this.output + this.file + '.pdf';

        if (this.logLevel >= 2) {
            console.log('Delete pdf: ' + file);
        }

        fs.exists(file, function(exists) {
            if (exists) {
                fs.unlink(file, function(error) {
                    if (error) {
                        if (this.logLevel >= 1) {
                            console.error('Cannot delete pdf', error);
                        }

                        this.failed.push({
                            file:    this.currentFile,
                            failure: 'unlink',
                            error:   error
                        });
                    }
                });
            }
        });
    }
}

module.exports = Converter;
