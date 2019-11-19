const express = require('express')
const app = express()
const path = require('path')
const { promisify } = require('util')
const sgMail = require('@sendgrid/mail');

const GoogleSpreasheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')
const docId = proccess.env.DOC_ID
const worksheetIndex = 0
const sendGridKey = proccess.env.SENDGRID_KEY

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'views'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.get('/', ( req, res) => {
  res.render('home')
})

app.post('/', async( req, res) => {
  try {
    const doc = new GoogleSpreasheet(docId)
    await promisify(doc.useServiceAccountAuth)(credentials)
    console.log('open')
    const info = await promisify(doc.getInfo)()
    const worksheet = info.worksheets[worksheetIndex]
    await promisify(worksheet.addRow)({
      name: req.body.name,
      email: req.body.email,
      issueType: req.body.issueType,
      source: req.query.source || 'Direct',
      howToReproduce: req.body.howToReproduce,
      expectedOutput: req.body.expectedOutput,
      receivedOutput: req.body.receivedOutput,
      userAgent: req.body.userAgent,
      userDate: req.body.userDate
    })

    if(req.body.issueType === 'CRITICAL') {
      sgMail.setApiKey(sendGridKey);
      const msg = {
        to: 'ester_sgomes@hotmail.com',
        from: 'ester_sgomes@hotmail.com',
        subject: 'BUG CRITICAL reportado!',
        text: `O usuário ${req.body.name} reportou um problema.`,
        html: `O usuário ${req.body.name} reportou um problema.`,
      };
      await sgMail.send(msg);
    }
    res.render('success')
  } catch (error) {
    res.send('erro envio formulario')
  }
})

app.listen(3000, (err) => {
  if(err) {
    console.log('aconteceu um erro', err)
  } else {
    console.log('BugTracker rodando na porta 3000')
  }
})