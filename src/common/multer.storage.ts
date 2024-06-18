import multer from 'multer';

export const MulterStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/images');
  },
  filename: function (req, file, cb) {
    console.log(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});
