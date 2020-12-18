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

const getFileName = (path) => {
    return path.split('/').pop();
};

const makeFileWritable = (path) => {
    fs.chmodSync(path, 0o755);
};

export {
    exists,
    folderExists,
    fileExists,
    getFileName,
    makeFileWritable
};
