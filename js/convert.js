const fs = require('fs');
const Jimp = require('jimp');
const pdf2image = require('pdf2image');
const unoconv = require('unoconv2');

/**
 * PPT to PNG converter.
 */
class Converter {
    /**
     * Constructor.
     *
     * @param {object} options
     */
    constructor(options) {
        this.files = options.files;
        this.filesDone = [];
        this.output = options.output;
        this.invert = options.invert || false;
        this.deletePdfFile = options.deletePdfFile || true;
        this.outputType = options.outputType || 'png';
        this.logLevel = options.logLevel || 1;
        this.callback = options.callback || null;
        this.fileNameFormat = options.fileNameFormat || '_page_%d',
        this.song = 0;
        this.start = Date.now();
        this.songConvertTime = this.start;
        this.songs = [];
        this.ready = false;
        this.promise = false;
        this.resolve = null;
        this.reject = null;
        this.version = '0.1.2';
    }

    /**
     * With this function, you can use the promise function.
     *
     * @return {object}
     */
    wait() {
        var promise;

        this.promise = true;

        promise = new Promise(this.next.bind(this));

        return promise;
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
     * Start the script.
     *
     * @return {object}
     */
    run() {
        this.next();

        return this;
    }

    /**
     * Get the next file.
     *
     * @param {object} resolve
     * @param {object} reject
     */
    next(resolve, reject) {
        var totalTime = Date.now() - this.start;
        var songTime = Date.now() - this.songConvertTime;

        if(resolve && this.promise == true) {
            this.resolve = resolve;
        }
        if(reject && this.promise == true) {
            this.reject = reject;
        }

        this.songConvertTime = Date.now();

        if (this.files.length < 1) {
            if (this.song > 0 && this.logLevel >= 1) {
                console.log('Total time: ' + totalTime + 'ms for ' + this.song + ' songs');
            }

            if(this.logLevel >= 3) {
                console.log(this.songs);
            }

            this.ready = true;
            if(this.promise == true) {
                this.resolve({
                    songs: this.songs,
                    files: this.filesDone,
                    time:  totalTime
                });
            }

            if(this.callback) {
                this.callback({
                    songs: this.songs,
                    files: this.filesDone,
                    time:  totalTime
                });
            }

            return;
        }

        this.song++;
        if (this.logLevel >= 1) {
            console.log('song: ' + this.song + ', time: ' + songTime + ' ms, total time: ' + totalTime + 'ms');
        }

        this.currentFile = this.files.pop();
        this.filesDone.push(this.currentFile);

        this.convert(this.currentFile, this.song);
    }

    /**
     * Convert function.
     *
     * @param {string} file
     * @param {int} song
     */
    convert(file, song) {
        var fileName = file.split('/').pop();
        var numbers = fileName.match(/\d+/g);

        if (this.logLevel >= 2) {
            console.log('convert: ' + file);
        }

        unoconv.convert(file, 'pdf', {}, this.convertedToPdf.bind(this, song, numbers));
    }

    /**
     * Convert PDF to PNG.
     *
     * @param {int} song
     * @param {array} numbers
     * @param {object} error
     * @param {object} result
     */
    convertedToPdf(song, numbers, error, result) {
        var pdfFile = this.output + song;
        var pngFile = this.output + numbers.join('_');
        var converter = pdf2image.compileConverter({
            outputFormat: pngFile + this.fileNameFormat,
            outputType:   this.outputType
        });

        if (this.logLevel >= 2) {
            console.log('converted to pdf (' + pdfFile + ')');
        }

        if (error) {
            if (this.logLevel >= 1) {
                console.error('error on converting to pdf');
            }

            this.next();

            return;
        }

        // result is returned as a Buffer
        fs.writeFile(pdfFile + '.pdf', result);

        if (this.logLevel >= 2) {
            console.log('pdf saved (' + pngFile + ')');
        }

        // converts all the pages of the given pdf using the default options
        converter.convertPDF(pdfFile + '.pdf')
            .then(
                this.convertedToPng.bind(this)
            )
            .catch(
                this.next.bind(this)
            );
    }

    /**
     * Convert to png.
     *
     * @param {array} pageList
     */
    convertedToPng(pageList) {
        if (this.logLevel >= 2) {
            console.log('converted to: ' + this.outputType);
        }

        if (this.deletePdfFile) {
            this.deletePdf();
        }

        if (this.invert) {
            pageList.forEach(this.page.bind(this));
        }

        this.songs.push(pageList);

        this.next();
    }

    /**
     * A song page.
     *
     * @param {object} element
     */
    page(element) {
        var file = element.path;

        Jimp.read(file, this.invertPage.bind(this, file));
    }

    /**
     * Invert page.
     *
     * @param {string} file
     * @param {object} error
     * @param {object} image
     */
    invertPage(file, error, image) {
        if (error) {
            if (this.logLevel >= 1) {
                console.error('invering page error', error);
            }

            return;
        }
        image.invert().write(file);
    }

    /**
     * Delete a file.
     *
     * @param {string} file
     */
    deletePdf() {
        var file = this.output + this.song + '.pdf';

        if (this.logLevel >= 2) {
            console.log('delete pdf: ' + file);
        }

        fs.exists(file, function(exists) {
            if (exists) {
                fs.unlink(file, function(error) {
                    if (error && this.logLevel >= 1) {
                        console.error('cannot delete pdf', error);
                    }
                });
            }
        });
    }
}

module.exports = Converter;
