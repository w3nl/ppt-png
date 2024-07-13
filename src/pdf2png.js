import Pdf2PngConverter from '@hckrnews/pdf2png';

export default ({ file, output, density, quality }) => {
    const pdfConverter = Pdf2PngConverter.create({
        file,
        output,
        density,
        quality,
    });

    return pdfConverter.convert();
};
