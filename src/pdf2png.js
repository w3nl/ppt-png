import Pdf2PngConverter from '@hckrnews/pdf2png';

export default ({ file, output }) => {
    const pdfConverter = Pdf2PngConverter.create({
        file,
        output,
    });

    return pdfConverter.convert();
};
