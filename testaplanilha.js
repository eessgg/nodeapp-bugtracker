const GoogleSpreadsheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')

const { promify } = require('util')

const addRowToSheet = async() => {
  const doc = new GoogleSpreadsheet('1lULurb2uxQA0W3QiYBJHe3jFqPOMG3ZjWOjsT3nzc2M')
  await promify(doc.useServiceAccountAut)(credentials)
  console.log('open')
  const info = promify(doc.getInfo)()
  const worksheet = info.worksheets[0]
  promify(worksheet.addRow({ name: 'TEST', email: 'test' }))
}

addRowToSheet()

// const doc = new GoogleSpreadsheet('1lULurb2uxQA0W3QiYBJHe3jFqPOMG3ZjWOjsT3nzc2M')
// app.post('/', ( req, res) => {
//   const doc = new GoogleSpreasheet(docId)
//   doc.useServiceAccountAuth(credentials, (err) => {
//     if(err) {
//       console.log('not open')
//     } else {
//       console.log('open')
//       doc.getInfo((err, info) => {
//         const worksheet = info.worksheets[worksheetIndex]
//         worksheet.addRow(
//           { name: req.body.name, email: req.body.email }, err => { res.send('bug reportado com sucesso!')
//         })
//       })
//     }
//   })
// })

