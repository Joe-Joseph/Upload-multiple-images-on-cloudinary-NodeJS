const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')

const upload = require('./multer')
const cloudinary = require('./cloudinary')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/upload-images', upload.array('image'), async(req, res) => {
    const uploader = async (path) => await cloudinary.uploads(path, 'Images')

    if(req.method === 'POST'){
        const urls = []
        const files = req.files

        for (let file of files) {
            const { path } = file

            const newPath = await uploader(path)

            urls.push(newPath)
            fs.unlinkSync(path)
        }

        res.status(200).json({
            message: 'Images uploaded successfulyy',
            data: urls
        })
    }  else{
        res.status(405).json({
            err: 'Image not uploaded successfully'
        })
    }  
})

app.listen(5000, () => {
    console.log("Server is listening on port 5000")
})