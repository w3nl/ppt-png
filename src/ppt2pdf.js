import PptToPdfConverter from '@hckrnews/ppt2pdf';

export default ({ file, output }) => {
    const pptConverter = PptToPdfConverter.create({
        file: file.path,
        output,
    });

    pptConverter.convert();

    return pptConverter.pdf;
};
