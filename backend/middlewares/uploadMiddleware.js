
const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../config/s3Config");

/**
 * @description Multer upload configuration with S3 storage
 */
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname }); 
        },
        key: (req, file, cb) => {
            const fileName = `${Date.now()}_${file.originalname}`;
            cb(null, fileName);
        }
    }),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB file size limit
});


/**
 * @description Optional file upload middleware that doesn't error when no file is present
 */
const optionalUploadSingle = (req, res, next) => {
    upload.single("image")(req, res, function (err) {
        if (err) {
            return res.status(400).json({ status: false, error: err.message });
        }
        next();
    });
};

/**
 * @description Middleware to process uploaded file and add file location to request body
 */
const uploadToS3 = (req, res, next) => {
    if (req.file) {
        req.body.imageUrl = req.file.location;
    }
    next();
};

module.exports = {
    optionalUploadSingle,
    uploadToS3           
};
