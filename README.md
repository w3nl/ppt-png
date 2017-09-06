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

    sudo apt install unoconv libreoffice-dev imagemagick


## Basic Usage

```
new Converter({
    files:    files,
    output:   'output/'
    invert:   true,
    callback: function(data) {
        console.log(data.songs, data.files, data.time);
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
    console.log(data.songs, data.files, data.time);
});
```


files: Array with the files.

output: Output folder.

invert: Invert the colors, default is `false`;

deletePdfFile: Delete the pdf file after converting, default is `true`.

outputType: Output type, default is `png`.

logLevel: Set the log level, default is `1`.

callback: function calls when the script is ready.

The function and promise send an object to the first parameter.

```
{
    songs: [],
    files: [],
    time: 0
}
```

songs: an array with objects (page, index, name, path).

files: array with files send to the script.

time: total time the script was running.


[downloads-image]: https://img.shields.io/npm/dm/ppt-png.svg
[npm-url]: https://www.npmjs.com/package/ppt-png
[npm-image]: https://img.shields.io/npm/v/ppt-png.svg
