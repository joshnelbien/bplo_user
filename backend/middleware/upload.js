const multer = require("multer");

// Store file in memory so we can insert as BLOB
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;
