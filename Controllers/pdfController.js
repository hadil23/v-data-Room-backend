const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const File = require('../Models/files');

exports.downloadFileById = async (req, res) => {
    const { id } = req.params;

    try {
        const filePath = await File.getFileUrlById(id);

        if (!filePath) {
            return res.status(404).json({ message: 'File not found' });
        }

        const absolutePath = path.resolve(filePath);
        if (!fs.existsSync(absolutePath)) {
            return res.status(404).json({ message: 'File not found' });
        }

        const doc = new PDFDocument();
        const tempDir = path.join(__dirname, '..', 'temp');
        const tempFilePath = path.join(tempDir, `file-${id}.pdf`);

        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }

        const fileContent = fs.readFileSync(absolutePath, 'utf-8');
        doc.text(fileContent);
        doc.pipe(fs.createWriteStream(tempFilePath)).on('finish', () => {
            res.download(tempFilePath, `file-${id}.pdf`, (err) => {
                if (err) {
                    console.error('Error downloading file:', err);
                    res.status(500).json({ message: 'Error downloading file', error: err });
                }

                fs.unlinkSync(tempFilePath);
            });
        });

        doc.end();
    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).json({ message: 'Error downloading file', error });
    }
};
