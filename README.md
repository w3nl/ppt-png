# ppt-png
Convert ppt to png.

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url]

If you want convert powerpoint files to png images, you can do it with this script.

## Requirements

The package requires the following software to be installed:

* unoconv
* LibreOffice-dev
* ImageMagick

## Installation

    npm install ppt-png

Debian/Ubunut:

    sudo apt-get install unoconv libreoffice-dev imagemagick


## Basic Usage

```
new Converter({
    files:  files,
    output: 'output/'
    invert: true
});
```

files: Array with the files.

output: Output folder.

invert: Invert the colors, default is `false`;

deletePdfFile: Delete the pdf file after converting, default is `true`.

outputType: Output type, default is `png`.

logLevel: Set the log level, default is `1`.


[downloads-image]: https://img.shields.io/npm/dm/ppt-png.svg
[npm-url]: https://www.npmjs.com/package/ppt-png
[npm-image]: https://img.shields.io/npm/v/ppt-png.svg
