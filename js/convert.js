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
        this.invert = options.invert || false;
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
        console.log('convert');
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

        console.log('converted to pdf');

        if (error) {
            console.error('error on converting to pdf');

            this.next();

            return;
        }

        // result is returned as a Buffer
        fs.writeFile(file + '.pdf', result);

        console.log('pdf saved');

        // converts all the pages of the given pdf using the default options
        converter.convertPDF(file + '.pdf')
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
        console.log('converted to png');
        this.deletePdf();

        if(this.invert) {
            pageList.forEach(this.page.bind(this));
        }

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
            console.error('invering page error', error);

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

        console.log('delete pdf');

        fs.exists(file, function(exists) {
            if (exists) {
                fs.unlink(file, function(error) {
                    if(error) {
                        console.error('cannot delete pdf', error);
                    }
                });
            }
        });
    }
}

module.exports = Converter;
