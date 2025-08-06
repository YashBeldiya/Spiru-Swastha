const router = require("express").Router();
// const validationReq = require("../utils/validationAsync");
const path = require('path')
const multer = require('multer');
const { createCategory, updateCategory, deleteCategory, getallCategory, getCategory } = require("../controllers/category");

function getRandomChar() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return chars.charAt(Math.floor(Math.random() * chars.length));
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/CategoryImages')
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}${getRandomChar()}${path.extname(file.originalname)}`)
    }
  })
  
  const upload = multer({ storage: storage })

  router.get('/all-category',getallCategory)
  router.get('/getcategory/:id',getCategory)

router.post("/create", createCategory);

router.post('/update/:id',updateCategory)

router.delete('/delete/:id',deleteCategory)

module.exports = router;
