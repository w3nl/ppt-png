# ppt-png
Convert ppt to image (png,jpg).

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-stats] [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url]

If you want convert powerpoint files to png or jpg images, you can do it with this script.

## Requirements

The package requires the following software to be installed:

* LibreOffice-dev
* ImageMagick
* pdfinfo

## Installation

Minimum node version: `14`

    `npm install ppt-png`

Debian/Ubuntu:

    `sudo apt install libreoffice-dev imagemagick poppler-utils`

Mac:

    `brew install imagemagick poppler ghostscript`


## Basic Usage (node.js 14)

```
import Converter from 'ppt-png'

const converter = Converter.create({
    files:  ['test/OPW 733 Tienduizend redenen.ppt'],
    output: 'output/'
});

const result = converter.convert();
```

files: Array with the files.

output: Output folder.

### Todo:
invert: Invert the colors, default is `false`;

greyscale: Greyscale the colors, default is `false`;

deletePdfFile: Delete the pdf file after converting, default is `true`.

outputType: Output type, default is `png`, but `jpg` is also possible.

documentConvert: Overrule the document convert command, default is `'libreoffice --headless --convert-to pdf --outdir'`

density: Density setting to convert the PDF to image at, defaults to 96 DPI

width: Width of the output images if density is not used

height: Height of the output images if density is not used

logLevel: Set the log level, default is `1`.


## Test the package.

```
npm test
```

This will run all the tests in the test folder with mocha.

If you only want to check the eslint rules, just run.

```
npm run lint
```


[downloads-image]: https://img.shields.io/npm/dm/ppt-png.svg
[npm-url]: https://www.npmjs.com/package/ppt-png
[npm-image]: https://img.shields.io/npm/v/ppt-png.svg
[npm-stats]: https://npm-stat.com/charts.html?package=ppt-png
[travis-url]: https://travis-ci.org/w3nl/ppt-png
[travis-image]: https://img.shields.io/travis/w3nl/ppt-png/master.svg
[coveralls-url]: https://coveralls.io/r/w3nl/ppt-png
[coveralls-image]: https://img.shields.io/coveralls/w3nl/ppt-png/master.svg
