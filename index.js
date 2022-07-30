const path = require('path')
const express = require('express')
const app = express()
const port = 8080
const { Storage } = require('@google-cloud/storage')
const Multer = require('multer')
const src = path.join(__dirname, 'views')

app.use(express.static(src))

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger 5mb , change as you need
  },
})

let projectId = 'paiku-357914'
let keyFilename = 'myKey.json'

const storage = new Storage({
  projectId,
  keyFilename,
})
const bucket = storage.bucket('sample_youtube_storage') // to be defined

app.get('/upload', async (req, res) => {
  const [files] = await bucket.getFiles()

  res.send([files])
})

app.post('/upload', multer.single('imgfile'), (req, res) => {
  console.log('Made it /upload')
  try {
    if (req.file) {
      console.log('File found, trying to uploading...')
      const blob = bucket.file(req.file.originalname)
      const blobStream = blob.createWriteStream()

      blobStream.on('finish', () => {
        console.log('finished!')
        res.status(200).send('Success')
      })
      blobStream.end(req.file.buffer)
    } else throw 'error width img'
  } catch (err) {
    res.status(500).send(err)
  }
})

app.get('/', (req, res) => {
  res.render('index.html')
})

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
