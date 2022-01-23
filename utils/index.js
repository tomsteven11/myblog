const crypto = require('crypto');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

let upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            let date = new Date();
            let year = date.getFullYear();
            let month = (date.getMonth() + 1).toString().padStart(2, '0');
            let day = date.getDate();
            let dir = path.join(__dirname, '../public/uploads/' + year + month + day)
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, {
                    recursive: true
                })
            }
            cb(null, dir);
        },
        filename: function (req, file, cb) {
            let fileName = Date.now() + path.extname(file.originalname) // fileName就是上传⽂文件的⽂文件名
            cb(null, fileName)
        }
    })
})

function md5(s) {
    return crypto.createHash('md5').update(String(s)).digest('hex');
}

module.exports = {
    md5,
    upload,
}