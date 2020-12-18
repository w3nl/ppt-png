import fs from 'fs';

const folderExists = (path) => {
    return fs.existsSync(path);
};

const fileExists = (path) => {
    return fs.existsSync(path);
};

export {
    folderExists,
    fileExists
};
