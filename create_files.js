var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
const Handlebars = require('handlebars');
const {createPage} = require('./server-connect')
const createFile = module.exports

createFile.addFiles = async (data) => {
  const { type } = data
  switch (type) {
    case "LOCAL":
      return addFilesLocal(data)
    case "NUBE":
      data.name = `${data.name}-${Date.now()}`
      const { error, status } =  await addFilesCloud(data)
      await createPage(data.name)
      if(error){
        return {error:error}
    }
    return {ok:status}
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
  let { env, name } = data
  const completeFolder = `./files/${name}`
  const exist = await existsAsync(completeFolder)
  if (exist) {
    return { error: 'folder_already_exist' }
  }
  fs.mkdirSync(completeFolder);
  const info = await getData(`./templates/local/${env.toLowerCase()}-docker-compose.txt`)
  const template = Handlebars.compile(info);
  const infoNew = template(data)
  await writeFile(`${completeFolder}/docker-compose.yml`,infoNew)

  return { status: `https://desarrollo.planestic.udistrital.edu.co/${name}` }
}

const getData = (name) => {
  return fs.readFileAsync(name, 'utf8')
}


const existsAsync = (path) => {
  return new Promise(function(resolve, reject){
    fs.exists(path, function(exists){
      resolve(exists);
    })
  })
}

const writeFile = (path, data) => {
  return new Promise(function(resolve, reject){
      fs.writeFile(path, data, function(ok){
        resolve(ok);
      })
    })
}

