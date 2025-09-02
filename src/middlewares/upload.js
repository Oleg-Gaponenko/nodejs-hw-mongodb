import multer from 'multer';
import os from 'node:os';
import path from 'node:path';

const photoStorage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, os.tmpdir());
  },
  filename: (request, file, callback) => {
    const uniqueFileName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    callback(null, `${uniqueFileName}${path.extname(file.originalname)}`);
  },
});

function photoFilter(request, file, callback) {
  if (/^image\/(png|jpe?g|gif|webp|bmp|svg\+xml)$/.test(file.mimetype))
    callback(null, true);
  else
    callback(
      new Error(
        'Add a supported image file type such as png, jpeg, gif, webp, bmp, etc.',
      ),
      false,
    );
}

export const upload = multer({
  storage: photoStorage,
  fileFilter: photoFilter,
  limits: { fileSize: 16 * 1024 * 1024 },
});
