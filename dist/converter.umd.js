(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.pptPng = factory());
}(this, (function () {
    /**
     * File model
     */
    class File {
      /**
       * Define the path
       */
      constructor() {
        this.path = null;
      }
      /**
       * Set the path
       *
       * @param {string} path
       */


      setPath(path) {
        if (!path || path.constructor !== String) {
          throw new Error('File path should be a string');
        }

        this.path = path;
      }
      /**
       * Create a file model
       *
       * @param {string} filePath
       *
       * @return {object}
       */


      static create({
        filePath
      }) {
        const file = new File();
        file.setPath(filePath);
        return file;
      }

    }

    /**
     * Converter
     */

    class Converter {
      /**
       * Define the files array
       */
      constructor() {
        this.files = [];
      }
      /**
       * Set the files
       *
       * @param {array} files
       */


      setFiles(files) {
        if (!files || files.constructor !== Array) {
          throw new Error('Files should be a array');
        }

        this.files = files.map(file => File.create({
          filePath: file
        }));
      }
      /**
       * Create the converter
       *
       * @param {array} files
       *
       * @return {object}
       */


      static create({
        files
      }) {
        const converter = new Converter();
        converter.setFiles(files);
        return converter;
      }

    }

    return Converter;

})));
//# sourceMappingURL=converter.umd.js.map
