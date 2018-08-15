import cloudinary from 'cloudinary';
import multer from 'multer';
import cloudinaryStorage from 'multer-storage-cloudinary';
import cloudinaryConfig from './cloudinaryConfig';

cloudinaryConfig();

const storage = cloudinaryStorage({
  cloudinary,
  folder: 'mydiary-app/',
  allowedFormats: ['jpg', 'png', 'jpeg', 'gif'],
  filename: (req, file, callback) => {
    callback(undefined, Number(Date.now()) + file.originalname);
  },
});

const upload = multer({
  storage,
});

export default upload;