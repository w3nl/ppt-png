# ppt-png
Convert ppt to image (png,jpg).

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-stats] [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url]

If you want convert powerpoint files to png or jpg images, you can do it with this script.

## Requirements

The package requires the following software to be installed:

* unoconv
* LibreOffice-dev
* ImageMagick
* pdfinfo

## Installation

    npm install ppt-png

Debian/Ubuntu:

    sudo apt install unoconv libreoffice-dev imagemagick poppler-utils


## Basic Usage

```
new Converter({
    files:    files,
    output:   'output/'
    invert:   true,
    callback: function(data) {
        console.log(data.failed, data.success, data.files, data.time);
    }
}).run();
```

## Promise based

```
new Converter({
    files:         files,
    output:        'output/',
    invert:        true,
    deletePdfFile: true,
    outputType:    'png',
    logLevel:      2
}).wait().then(function(data) {
    console.log(data.failed, data.success, data.files, data.time);
});
```


files: Array with the files.

output: Output folder.

invert: Invert the colors, default is `false`;

greyscale: Greyscale the colors, default is `false`;

deletePdfFile: Delete the pdf file after converting, default is `true`.

outputType: Output type, default is `png`, but `jpg` is also possible.

logLevel: Set the log level, default is `1`.

callback: Function calls when the script is ready.

The function and promise send an object to the first parameter.

```
{
    failed: [],
    success: [],
    files: [],
    time: 0
}
```

failed: An array with objects for failed converting files (file, failure, error)

success: An array with objects for converted files (page, index, name, path).

files: An array with files send to the script.

time: The total time the script was running.


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
