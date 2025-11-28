import multer from "multer";

export function multerErrorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Ukuran file terlalu besar. Maksimal 2MB" 
      });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        message: "File tidak sesuai. Harap cek field name.",
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  next(err);
}


