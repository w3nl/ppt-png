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
        this.output = options.output;
        this.song = 0;
        this.start = Date.now();

        this.next();
    }

    /**
     * Get the next file.
     */
    next() {
        var time = Date.now() - this.start;

        if(this.files.length < 1) {
            if(this.song > 0) {
                console.log('Total time: ' + time + 'ms for ' + this.song + ' songs');
            }

            return;
        }

        this.song++;
        console.log('song: ' + this.song + ' time: ' + time + ' ms');
        this.currentFile = this.files.pop();

        this.convert(this.currentFile, this.song);
    }

    /**
     * Convert function.
     *
     * @param {string} file
     * @param {int} song
     */
    convert(file, song) {
        unoconv.convert(file, 'pdf', {}, this.convertedToPdf.bind(this, song));
    }

    /**
     * Convert PDF to PNG.
     *
     * @param {int} song
     * @param {object} error
     * @param {object} result
     */
    convertedToPdf(song, error, result) {
        var file = this.output + song;
        var converter = pdf2image.compileConverter({
            outputFormat: file + '_page_%d',
            outputType:   'png'
        });

        if (error) {
            console.log('error 1');

            return;
        }

        // result is returned as a Buffer
        fs.writeFile(file + '.pdf', result);

        // converts all the pages of the given pdf using the default options
        converter.convertPDF(file + '.pdf').then(
            this.convertedToPng.bind(this)
        );
    }

    /**
     * Convert to png.
     *
     * @param {array} pageList
     */
    convertedToPng(pageList) {
        this.deletePdf();

        pageList.forEach(this.page.bind(this));

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
     * @param {object} err
     * @param {object} image
     */
    invertPage(file, err, image) {
        if (err) {
            throw err;
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

        fs.exists(file, function(exists) {
            if (exists) {
                fs.unlink(file, function(err) {
                    if(err) {
                        console.log(err);
                    }
                });
            }
        });
    }
}

module.exports = Converter;
