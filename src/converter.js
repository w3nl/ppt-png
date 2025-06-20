import { Converter, File } from '@hckrnews/converter'
import pdf2png from './pdf2png.js'
import ppt2pdf from './ppt2pdf.js'
/**
 * @typedef {import('./pdf2png.js').Converter} Converter
 * @typedef {object} Options
 * @property {number=} quality
 * @property {number=} density
 */

class Ppt2PngConverter extends Converter {
  /**
   * Define the files array
   */
  constructor () {
    super()
    this.files = []
    this.density = null
    this.quality = null
  }

  /**
   * Set the files
   * @param {Array} files
   */
  setFiles (files) {
    if (!files || files.constructor !== Array) {
      throw new Error('Files should be a array')
    }

    this.files = files.map((file) =>
      File.create({
        filePath: file
      })
    )
  }

  /**
   * Convert ppt files to pdf files.
   * @returns {Converter[]}
   */
  convert () {
    return this.files.map((file) => {
      const pdf = ppt2pdf({
        file,
        output: this.output
      })

      return pdf2png({
        file: pdf,
        output: this.output,
        density: this.density,
        quality: this.quality
      })
    })
  }

  /**
   * Create the converter
   * @param {object} params
   * @param {Array} params.files
   * @param {string} params.output
   * @param {Options} params.options
   * @returns {object}
   */
  static create ({ files, output, options }) {
    const converter = new Ppt2PngConverter()

    converter.setFiles(files)
    converter.setOutput(output)

    converter.density = options?.density
    converter.quality = options?.quality

    return converter
  }
}

export default Ppt2PngConverter
export { Ppt2PngConverter, pdf2png, ppt2pdf }
