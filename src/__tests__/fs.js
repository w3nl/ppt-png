import {
    exists,
    folderExists,
    fileExists
} from '../fs.js';

const expectTestCases = [
    {
        description:          'It should return true for the exists and fileExists',
        input:                'test/OPW 733 Tienduizend redenen.ppt',
        expectedExists:       true,
        expectedFolderExists: false,
        expectedFileExists:   true
    },
    {
        description:          'It should return true for the exists and folderExists',
        input:                'output/',
        expectedExists:       true,
        expectedFolderExists: true,
        expectedFileExists:   false
    },
    {
        description:          'It should return false for all methods',
        input:                'unknownfolder/',
        expectedExists:       false,
        expectedFolderExists: false,
        expectedFileExists:   false
    }
];

describe.each(expectTestCases)(
    'FS helper test',
    ({
        description, input, expectedExists, expectedFolderExists, expectedFileExists
    }) => {
        it(description, () => {
            expect(exists(input)).toBe(expectedExists);
            expect(folderExists(input)).toBe(expectedFolderExists);
            expect(fileExists(input)).toBe(expectedFileExists);
        });
    }
);
