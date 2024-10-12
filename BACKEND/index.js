const express = require ("express")
const app = express()
const multer  = require('multer')
const docx2pdf = require('docx-pdf')
const cors = require("cors");
const path = require('path')
const port = 3000

app.use(cors())

// Setting up file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });
  
  // multer helps to uploads multi-formdata
  const upload = multer({ storage: storage });
  app.post('/convertfile', upload.single('file'), (req, res, next) => {
    try {
        if(!req.file){
            return res.status(404).json({
                message: "no file uploded",
            })
        }

        // defining output file path
        let outpath = path.join(
          __dirname,
          "files",
          `${req.file.originalname}.pdf`
        );

        docx2pdf(req.file.path,outpath,(err,result)=>{
            if(err){
              console.log(err);
              return res.status(500).json({
                message: "Error converting Files "
              });
            }
            res.download(outpath,()=>{
                console.log("file downloaded");
            })
          });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "internal server error",
        })
    }
  });



app.listen(port, () => {
    console.log(`server is running on ${port}`)
});