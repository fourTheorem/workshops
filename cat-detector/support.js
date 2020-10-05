const AWS = require('aws-sdk')
const fs = require('fs')
const canvas = require('canvas')
const tab = require('tableify')
const asnc = require('async')


module.exports.printS3Objects = function printS3Objects (content) {
  console.log()
  content.forEach(item => {
    console.log(item.Key + ' (' + item.Size + ')')
  })
  console.log()
}


module.exports.printRekResults = function printRekResults (res) {
  console.log()
  res.Labels.forEach(label => {
    console.log(`name: ${label.Name}, confidence: ${label.Confidence}`)
  })
  console.log()
}


module.exports.boxImage = function boxImage (faceDetails, inImage, outImage, cb) {
  canvas.loadImage(inImage).then((img) => {
    var cvs = canvas.createCanvas(img.width, img.height)
    var ctx = cvs.getContext('2d')
    ctx.drawImage(img, 0, 0, img.width, img.height)

    ctx.strokeStyle = 'red'
    ctx.lineWidth = 4
    console.log()
    faceDetails.forEach(face => {
      let f = face
      if (face.Face) { f = face.Face }
      let x = f.BoundingBox.Left * img.width
      let y = f.BoundingBox.Top * img.height
      let w = f.BoundingBox.Width * img.width
      let h = f.BoundingBox.Height * img.height
      ctx.strokeRect(x, y, w, h)
      console.log(`rect x=${x}, y=${y}, w=${w}, h=${h}`)
    })
    console.log()

    const out = fs.createWriteStream(outImage)
    cvs.createPNGStream().pipe(out)
    out.on('finish', () => {
      cb()
    })
  })
}


module.exports.boxCelebs = function boxImage (celebs, inImage, outImage, cb) {
  canvas.loadImage(inImage).then((img) => {
    var cvs = canvas.createCanvas(img.width, img.height)
    var ctx = cvs.getContext('2d')
    ctx.drawImage(img, 0, 0, img.width, img.height)

    console.log()
    ctx.strokeStyle = 'red'
    ctx.font = '20px Ariel'
    celebs.forEach(celeb => {
      let x = celeb.Face.BoundingBox.Left * img.width
      let y = celeb.Face.BoundingBox.Top * img.height
      let w = celeb.Face.BoundingBox.Width * img.width
      let h = celeb.Face.BoundingBox.Height * img.height
      ctx.lineWidth = 2
      ctx.strokeRect(x, y, w, h)
      ctx.lineWidth = 2
      ctx.strokeText(celeb.Name, x, y)
      console.log(`rect x=${x}, y=${y}, w=${w}, h=${h}`)
    })
    console.log()

    const out = fs.createWriteStream(outImage)
    cvs.createPNGStream().pipe(out)
    out.on('finish', () => {
      cb()
    })
  })
}


module.exports.printEntities = function printEntities (entities) {
  let groups = {}

  entities.forEach(entity => {
    if (!groups[entity.Type]) {
      groups[entity.Type] = []
    }
    groups[entity.Type].push(entity.Text)
  })

  const html = tab(groups)
  return html
}


module.exports.printKeyPhrases = function printKeyPhrases (phrases) {
  console.log()
  for (let idx = 0; idx < 20; idx++) {
    let kp = phrases[idx]
    console.log(kp.Text + ' (score: ' + kp.Score + ')')
  }
  /*
  phrases.forEach(kp => {
    console.log(kp.Text + ' (score: ' + kp.Score + ')')
  })
  */
  console.log()
}


function printClass (bucket, prefix, cb) {
  const s3 = new AWS.S3()
  let out = {}
  out[prefix] = []

  s3.listObjects({Bucket: bucket, Prefix: prefix}, (err, data) => {
    if (err || !data.Contents) { return cb(err) }

    asnc.eachSeries(data.Contents, (item, asnCb) => {
      s3.getObject({Bucket: bucket, Key: item.Key}, (err, data) => {
        if (err) { return asnCb(err) }

        let content = JSON.parse(data.Body.toString())
        delete content.source
        delete content.orignator
        delete content.originalLanguage
        delete content.originalText
        out[prefix].push(content)
        asnCb(null)
      })
    }, (err) => {
      cb(err, tab(out))
    })
  })
}


module.exports.printClassifications = function printClassifications (bucket, cb) {
  const classes = ['auto', 'beauty', 'office', 'pet', 'unclassified']
  let html = ''
  asnc.eachSeries(classes, (cls, asnCb) => {
    html += '<h2>' + cls + '</h2>'
    printClass(bucket, cls, (err, htmlTab) => {
      html += htmlTab
      asnCb(err)
    })
  }, (err) => {
    cb(err, html)
  })
}


module.exports.groupText = function groupText (result) {
  let info = {}

  result.Blocks.forEach((block, idx) => {
    if (block.BlockType === 'LINE' && block.Confidence > 75) {
      if (/Nationality/g.test(block.Text)) {
        info.nationality = result.Blocks[idx + 1].Text + ' (confidence: ' + block.Confidence + ')'
      }
      if (/Date.+birth/g.test(block.Text)) {
        info.dob = result.Blocks[idx + 1].Text + ' (confidence: ' + block.Confidence + ')'
      }
      if (/Place.+birth/g.test(block.Text)) {
        info.placeOfBirth = result.Blocks[idx + 2].Text + ' (confidence: ' + block.Confidence + ')'
      }
      if (/Date.+expiration/g.test(block.Text)) {
        info.dateOfExpiration = result.Blocks[idx + 1].Text + ' (confidence: ' + block.Confidence + ')'
      }
      if (/Date.+issue/g.test(block.Text)) {
        info.dateOfIssue = result.Blocks[idx + 2].Text + ' (confidence: ' + block.Confidence + ')'
      }
      if (/Given.+Names/g.test(block.Text)) {
        info.givenNames = result.Blocks[idx + 1].Text + ' (confidence: ' + block.Confidence + ')'
      }
      if (/Surname/g.test(block.Text)) {
        info.surname = result.Blocks[idx + 1].Text + ' (confidence: ' + block.Confidence + ')'
      }
      if (/^\d+$/g.test(block.Text)) {
        if (block.Text.length > 5) {
          info.passportNumber = block.Text + ' (confidence: ' + block.Confidence + ')'
        }
      }
    }
  })
  return info
}


function deleteKey (s3, bucket, key, cb) {
  const keep = ['code.js', 'index.html', 'templates.js', 'wordcloud2.js']
  if (keep.find(element => element === key)) {
    console.log('skipping: ' + key)
    cb()
  } else {
    console.log('deleting: ' + key)

    const params = {
      Bucket: bucket,
      Key: key
    }
    s3.deleteObject(params, (err, data) => {
      if (err) { console.log(err) }
      cb(err)
    })
  }
}


module.exports.cleanBucket = function (bucket, cb) {
  const s3 = new AWS.S3()
  let params = {
    Bucket: bucket,
    MaxKeys: 1000
  }
  s3.listObjectsV2(params, (err, data) => {
    if (err) { return cb(err) }

    asnc.eachSeries(data.Contents, (file, asnCb) => {
      deleteKey(s3, bucket, file.Key, asnCb)
    }, (err) => {
      cb(err, 'done')
    })
  })
}

