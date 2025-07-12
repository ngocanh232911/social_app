import multer from "multer";
import path from "path";

// const uploadDir = "uploads/";
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }
// Cấu hình nơi lưu và tên file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // thư mục lưu ảnh
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // lấy đuôi ảnh (.jpg, .png,...)
    cb(null, Date.now() + ext); // đặt tên file = timestamp
  },
});

// Chỉ cho phép file ảnh
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg",
    "image/png",
    "image/jpg",
    "image/gif",
    "video/mp4",
    "video/quicktime", 
];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ chấp nhận file ảnh"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});
export default upload;