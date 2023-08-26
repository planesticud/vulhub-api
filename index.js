const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const port =process.env.PORT || 3000
const {addFiles} = require('./create_files')

app.use(bodyParser.json());
app.use(cors())
app.use(morgan('tiny'))

app.post('/envs', async (req, res) => {
    const response = await addFiles(req.body)
  res.send(response)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


