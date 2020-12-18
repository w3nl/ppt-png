import fs from 'fs';

const exists = (path) => {
    return fs.existsSync(path);
};

const folderExists = (path) => {
    if(!exists(path)) {
        return false;
    }

    return fs.statSync(path).isDirectory();
};

const fileExists = (path) => {
    if(!exists(path)) {
        return false;
    }

    return fs.statSync(path).isFile();
};

export {
    exists,
    folderExists,
    fileExists
};
