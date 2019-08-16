/* eslint-disable no-case-declarations*/
const util = require('util');
const exec = require('child_process').exec;
const vm = require('vm');

/**
 * The pdf converter.
 */
class Converter {
    /**
     * Converter contructor.
     *
     * @param {object} options
     */
    constructor(options = {}) {
        this.options = processOptions(options);
    }
    /**
     * Convert single pdf file.
     *
     * @param {string} pdfFilePath
     *
     * @return {Promise}
     */
    convertPDF(pdfFilePath) {
        return generateConvertPromise(pdfFilePath, this.options);
    }
}

module.exports.compileConverter = function(options) {
    return new Converter(options);
};

/**
 * Generate convert promise.
 *
 * @param {string} pdfFilePath
 * @param {object} options
 *
 * @return {Promise}
 */
function generateConvertPromise(pdfFilePath = '', options) {
    const cleanFilePath = pdfFilePath.toString().trim();

    if (cleanFilePath == '') {
        return new Promise(function(resolve, reject) {
            reject('Empty filePath.');
        });
    }

    return new Promise(function(resolve, reject) {
        readPDFInfo(cleanFilePath).then(function(pdfInfo) {
            const filePath = getFileDirectoryPath(cleanFilePath);
            const fileName = getFileNameFromPath(cleanFilePath);
            const pages = options.pages(pdfInfo.Pages);

            if (options.singleProcess) {
                if (pages.length > 0) {
                    processPagesSequentially(
                        pages,
                        pdfInfo.Pages,
                        fileName,
                        filePath,
                        options,
                        cleanFilePath,
                        resolve,
                        reject,
                        0
                    );
                } else {
                    resolve([]);
                }
            } else {
                let promises = [];

                for (let i = 0; i < pages.length; i++) {
                    promises.push(
                        createPagePromise(
                            pages[i],
                            i + 1,
                            pages.length,
                            pdfInfo.Pages,
                            fileName,
                            filePath,
                            options,
                            cleanFilePath
                        )
                    );
                }
                Promise.all(promises).then(function(list) {
                    resolve(list);
                }, function(errorList) {
                    reject(errorList);
                });
            }
        }, function(error) {
            reject(error);
        });
    });
}

/**
 * Process pages sequentially.
 *
 * @param {Array} pageList
 * @param {number} totalPDFPages
 * @param {string} fileName
 * @param {string} filePath
 * @param {Array} options
 * @param {string} pdfFilePath
 * @param {Function} resolve
 * @param {Function} reject
 * @param {number} i
 * @param {Array}  resultList
 */
function processPagesSequentially(
    pageList,
    totalPDFPages,
    fileName,
    filePath,
    options,
    pdfFilePath,
    resolve,
    reject,
    i,
    resultList = []
) {
    createPagePromise(
        pageList[i],
        i + 1,
        pageList.length,
        totalPDFPages,
        fileName,
        filePath,
        options,
        pdfFilePath
    ).then(function(result) {
        resultList.push(result);
        if (pageList.length > (i + 1)) {
            processPagesSequentially(
                pageList,
                totalPDFPages,
                fileName,
                filePath,
                options,
                pdfFilePath,
                resolve,
                reject,
                i + 1,
                resultList
            );
        } else {
            resolve(resultList);
        }
    }, function(error) {
        reject(error);
    });
}

/**
 * Get file directory path.
 *
 * @param {string} filePath
 *
 * @return {string}
 */
function getFileDirectoryPath(filePath) {
    return filePath.substring(0, filePath.lastIndexOf('/'));
}

/**
 * Get file name from path.
 *
 * @param {string} filePath
 *
 * @return {string}
 */
function getFileNameFromPath(filePath) {
    const aux = filePath.split('/').pop().split('.');

    return aux[0] != '' ? aux[0] : aux[1];
}

/**
 * Generate output format function.
 *
 * @param {string} outputFormatString
 *
 * @return {Function}

    A token starts with the character '%'

    d - the page number, if the first page of the PDF is page 1
    D - the page number, if the first page of the PDF is page 0
    i - the processed page number, if the first processed page is page 1
    I - the processed page number, if the first processed page is page 0
    t - the total number of pages in the pdf
    T - the total of processed pages
    s - the name of the pdf file
    p - the path of the pdf file
    % - the character '%'
    {...} - a custom piece of code where all of the above values can be used
 */
function generateOutputFormatFunction(outputFormatString) {
    let tokenList = [];
    let unreadPos = 0;
    let context = '';

    for (let i = 0; i < outputFormatString.length; i++) {
        if (outputFormatString.charAt(i) == '%') {
            tokenList.push('\'' + outputFormatString.substring(unreadPos, i) + '\'');
            // bypasses the identifier
            i += 1;

            switch (outputFormatString.charAt(i)) {
            case 'd':
                tokenList.push('pageNum');
                break;
            case 'D':
                tokenList.push('(pageNum-1)');
                break;
            case 'i':
                tokenList.push('pageIndex');
                break;
            case 'I':
                tokenList.push('(pageIndex-1)');
                break;
            case 's':
                tokenList.push('name');
                break;
            case 'p':
                tokenList.push('path');
                break;
            case '%':
                tokenList.push('\'%\'');
                break;
            case 't':
                tokenList.push('totalPDFPages');
                break;
            case 'T':
                tokenList.push('totalPagesProcessed');
                break;
            case '{':
                let start = i + 1;
                let remainingBrackets = 0;

                while (outputFormatString.charAt(i)) {
                    if (outputFormatString.charAt(i) != '}') {
                        i++;
                    } else {
                        if (remainingBrackets) {
                            remainingBrackets--;
                            i++;
                        } else {
                            break;
                        }
                    }

                    if (outputFormatString.charAt(i) == '{') {
                        remainingBrackets++;
                    }
                }
                if (outputFormatString.charAt(i)) {
                    tokenList.push('vm.runInContext(\'' + outputFormatString.substring(start, i) + '\',context)');
                    if (!context) {
                        context = 'var context=vm.createContext({d:pageNum,' +
                                'D:pageNum-1,' +
                                'i:pageIndex,' +
                                'I:pageIndex-1,' +
                                's:name,' +
                                'p:path,' +
                                't:totalPDFPages,' +
                                'T:totalPagesProcessed});';
                    }
                }
                break;
            default:
                break;
            }
            unreadPos = i + 1;
        }
    }
    tokenList.push('\'' + outputFormatString.substring(unreadPos, outputFormatString.length) + '\'');

    return new Function(
        'pageNum',
        'pageIndex',
        'totalPagesProcessed',
        'totalPDFPages',
        'name',
        'path',
        'vm',
        context + 'return ""+' + tokenList.join('+')
    );
}

/**
 * Process options.
 *
 * @param {Array} receivedOptions [description
 *
 * @return {Array}
 */
function processOptions(receivedOptions) {
    var options = {};

    options.outputType = processOutputType(receivedOptions.outputType);

    if (receivedOptions.density) {
        options.density = positiveIntOrDefault(receivedOptions.density, 96);
    } else if (receivedOptions.width || receivedOptions.height) {
        options.width = positiveIntOrDefault(receivedOptions.width, '');
        options.height = positiveIntOrDefault(receivedOptions.height, '');
    } else {
        options.density = 96;
    }

    // Its a jpg file
    if (options.outputType == '.jpg') {
        // quality is only relevant to jpg files
        options.quality = positiveIntOrDefault(receivedOptions.quality, 100);
        if (options.quality > 100) {
            options.quality = 100;
        }
    }
    switch (typeof receivedOptions.outputFormat) {
    case 'function':
        options.outputFormat = receivedOptions.outputFormat;
        break;
    case 'string':
        options.outputFormat = generateOutputFormatFunction(receivedOptions.outputFormat);
        break;
        // is the same as '%d'
    default:
        options.outputFormat = function(pageNum) {
            return pageNum.toString();
        };
    }
    options.pages = receivedOptions.pages ? processPages(receivedOptions.pages.toString()) : processPages('*');
    options.singleProcess = !!receivedOptions.singleProcess;
    options.backgroundColor = processBackgroundColor(receivedOptions.backgroundColor);

    if (options.backgroundColor == '' && options.outputType == '.jpg') {
        options.backgroundColor = '"#FFFFFF"';
    }

    options.stripProfile = !!receivedOptions.stripProfile;

    return options;
}

/**
 * Process output type.
 *
 * @param {string} type
 *
 * @return {string}
 */
function processOutputType(type = '') {
    let cleanType = type.toString();

    if (cleanType.charAt(0) == '.') {
        cleanType = cleanType.substring(1);
    }

    cleanType = cleanType.toLowerCase();

    if (cleanType == 'png') {
        return '.png';
    } else {
        return '.jpg';
    }
}

/**
 * Check if char is hex.
 *
 * @param {string} char
 *
 * @return {boolean}
 */
function isHex(char) {
    return char == '0' ||
        char == '1' ||
        char == '2' ||
        char == '3' ||
        char == '4' ||
        char == '5' ||
        char == '6' ||
        char == '7' ||
        char == '8' ||
        char == '9' ||
        char == 'a' ||
        char == 'b' ||
        char == 'c' ||
        char == 'd' ||
        char == 'e' ||
        char == 'f' ||
        char == 'A' ||
        char == 'B' ||
        char == 'C' ||
        char == 'D' ||
        char == 'E' ||
        char == 'F';
}

/**
 * Process background color.
 *
 * @param {string} color
 *
 * @return {string}
 */
function processBackgroundColor(color) {
    let newColor = color;

    if (typeof newColor != 'string') {
        return '';
    }
    if (newColor.charAt(0) != '#') {
        newColor += '#';
    }

    if (newColor.length == 7) {
        let validHex = true;

        for (let i = 1; i < 7; i++) {
            if (!isHex(newColor.charAt(i))) {
                validHex = false;
                break;
            }
        }
        if (validHex) {
            return '"' + newColor + '"';
        }
    }
}

/**
 * Create page promise.
 *
 * @param {[type]} pageNum
 * @param {[type]} pageIndex
 * @param {[type]} totalPagesProcessed
 * @param {[type]} totalPDFPages
 * @param {[type]} name
 * @param {[type]} path
 * @param {[type]} options
 * @param {[type]} pdfFilePath
 *
 * @return {[type]}
 */
function createPagePromise(pageNum, pageIndex, totalPagesProcessed, totalPDFPages, name, path, options, pdfFilePath) {
    return new Promise(function(resolve, reject) {
        const outputString = options.outputFormat(
            pageNum,
            pageIndex,
            totalPagesProcessed,
            totalPDFPages,
            name,
            path + (path ? '/' : ''),
            vm
        ) + options.outputType;
        let convertOptions = [];

        if (options.density) {
            convertOptions.push('-density ' + options.density);
        } else {
            convertOptions.push('-resize ' + options.width + (options.height ? 'X' + options.height : ''));
        }
        if (options.quality) {
            convertOptions.push('-quality ' + options.quality);
        }
        if (options.backgroundColor != '') {
            convertOptions.push('-background ' + options.backgroundColor + ' -flatten');
        }
        if (options.stripProfile != '') {
            convertOptions.push('-strip');
        }

        const aux = util.format(
            'convert %s "%s[%d]" "%s"',
            convertOptions.join(' '),
            pdfFilePath,
            pageNum - 1,
            outputString
        );

        exec(aux, function(err, stdout, stderr) {
            if (err) {
                reject(Error(err));
            } else {
                resolve({
                    page:  pageNum,
                    index: pageIndex,
                    name:  outputString.split('/').pop(),
                    path:  outputString
                });
            }
        });
    });
}

/**
 * Process pages.
 *
 * @param {string} pagesStr
 *
 * @return {Array}

    * -> everything

    1 -> page 1

    3-5 -> pages 3 to 5

    -7 -> pages 1 to 7

    6- -> pages 6 to the last

    /5 -> all values divisable by 5

    even -> all even numbers

    odd -> all odd numbers

*/
function processPages(pagesStr) {
    if (pagesStr === '*') {
        return function(length) {
            let pages = [];

            for (let i = 1; i <= length; i++) {
                pages.push(i);
            }

            return pages;
        };
    } else {
        const aux = pagesStr.toString().split(',');
        let ruleList = [];

        for (let option of aux) {
            if (option != '') {
                // TODO improve detection of options
                // fazer que opcoes repetidas nao sejam inseridas
                if (option === 'even') {
                    ruleList.push({
                        type: 'even'
                    });
                } else if (option === 'odd') {
                    ruleList.push({
                        type: 'odd'
                    });
                } else if (option.charAt(0) == '/') {
                    const x = positiveIntOrDefault(option.substring(1), undefined);

                    if (x) {
                        ruleList.push({
                            type:  'multiple',
                            value: x
                        });
                    }
                } else {
                    let x = option.split('-');

                    if (x.length == 1) {
                        x = positiveIntOrDefault(x[0], undefined);
                        if (x) {
                            ruleList.push({
                                type:  'page',
                                value: x
                            });
                        }
                    } else if (x.length == 2) {
                        if (x[0] == '') {
                            x[0] = '1';
                        }
                        x[0] = positiveIntOrDefault(x[0], undefined);
                        if (x[0]) {
                            if (x[1] == '') {
                                ruleList.push({
                                    type:  'range-max',
                                    start: x[0]
                                });
                            } else {
                                x[1] = positiveIntOrDefault(x[1], undefined);
                                if (x[1]) {
                                    // fazer que se forem trocados ficarem direitos
                                    if (x[0] < x[1]) {
                                        ruleList.push({
                                            type:  'range',
                                            start: x[0],
                                            end:   x[1]
                                        });
                                    } else if (x[0] > x[1]) {
                                        ruleList.push({
                                            type:  'range',
                                            start: x[1],
                                            end:   x[0]
                                        });
                                    } else {
                                        ruleList.push({
                                            type:  'page',
                                            value: x[0]
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return function(length) {
            return calculatePages(ruleList, length).sort(function(a, b) {
                return a - b;
            });
        };
    }
}

/**
 * Calculate pages.
 *
 * @param {Array} ruleList
 * @param {number} max
 *
 * @return {Array}
 */
function calculatePages(ruleList, max) {
    let pages = [];
    let pushVal = function(x) {
        if (pages.indexOf(x) == -1) {
            pages.push(x);
        }
    };

    for (let opc of ruleList) {
        switch (opc.type) {
        case 'page':
            if (opc.value <= max) {
                pushVal(opc.value);
            }
            break;
        case 'even':
            for (let i = 2; i <= max; i++) {
                if (i % 2 == 0) {
                    pushVal(i);
                }
            }
            break;
        case 'odd':
            for (let i = 1; i <= max; i++) {
                if ((i + 1) % 2 == 0) {
                    pushVal(i);
                }
            }
            break;
        case 'multiple':
            for (let i = 1; i <= max; i++) {
                if (i % opc.value == 0) {
                    pushVal(i);
                }
            }
            break;
        case 'range':
            const isntMax = (opc.end < max);
            const x = isntMax ? opc.end : max;

            for (let i = opc.start; i <= x; i++) {
                pushVal(i);
            }
            break;
        case 'range-max':
            for (let i = opc.start; i <= max; i++) {
                pushVal(i);
            }
            break;
        }
    }

    return pages;
}

/**
 * Positive integer or default.
 *
 * @param {Mixed} value
 * @param {Mixed} defaultValue
 *
 * @return {Mixed}
 */
function positiveIntOrDefault(value, defaultValue) {
    let currentValue = value;

    if (currentValue) {
        currentValue = Number.parseInt(currentValue);

        if (Number.isSafeInteger(currentValue) && currentValue > 0) {
            return currentValue;
        }
    }

    return defaultValue;
}

/**
 * Read PDF information.
 *
 * @param {string} pdfFilePath
 *
 * @return {Promise}
 */
function readPDFInfo(pdfFilePath) {
    return new Promise(function(resolve, reject) {
        exec('pdfinfo "' + pdfFilePath + '"', function(error, stdout, stderr) {
            if (error !== null) {
                console.error(error);
                reject(Error('Error reading pdf file "' + pdfFilePath + '".'));
            } else {
                let pdfInfo = {};
                const infoSplit = stdout.split('\n');

                for (let line of infoSplit) {
                    const aux = line.split(':');

                    pdfInfo[aux[0].trim()] = aux[1] ? aux[1].trim() : '';
                }
                resolve(pdfInfo);
            }
        });
    });
}
