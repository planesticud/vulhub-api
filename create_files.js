var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
const Handlebars = require('handlebars');

const createFile = module.exports

createFile.addFiles = async (data) => {
  const { type } = data
  switch (type) {
    case "LOCAL":
      return addFilesLocal(data)
    case "NUBE":
      return addFilesCloud(data)
    default:
      return { error: "unsoported type" }
  }
}

addFilesLocal = async (data) => {
  const { env } = data
  const info = await getData(`./templates/local/${env.toLowerCase()}-docker-compose.txt`)
  const template = Handlebars.compile(info);
  const infoNew = template(data)

  return { info: infoNew }
}

addFilesCloud = async (data) => {
  const { env } = data
  const info = await getData(`./templates/local/${env.toLowerCase()}-docker-compose.txt`)
  const template = Handlebars.compile(info);
  const infoNew = template(data)

  return { info: infoNew }
}

const getData = (name) => {
  return fs.readFileAsync(name, 'utf8')
}

