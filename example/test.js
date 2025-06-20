import { glob } from 'node:fs'
import {
  Ppt2PngConverter
} from '../src/converter.js'

// options is optional
glob('test/*.ppt*', {}, (error, files) => {
  console.log('files: ', files)
  if (files) {
    const converter = Ppt2PngConverter.create({
      files: files,
      output: 'output/',
      invert: true,
      greyscale: true,
      deletePdfFile: false,
      outputType: 'png',
      logLevel: 5,
      fileNameFormat: '_vers_%d',
      documentConvert: 'libreoffice --headless --convert-to pdf --outdir'
    })

    const result = converter.convert()

    console.log({
      result
    })
  }
})
