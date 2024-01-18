const fs = require("fs");
const { readdir, mkdir } = require('fs/promises');
const promises = fs.promises;
const path = require('path');
const option = {withFileTypes: true};
const recursive = {recursive: true};

const pathCopy = path.join(__dirname, 'project-dist');
promises.mkdir(pathCopy, recursive);

const dirPath = path.join(__dirname, 'styles');
const newCssPlace = path.join(__dirname, 'project-dist', 'style.css');

const writable = fs.createWriteStream(newCssPlace, 'utf-8');
const newCss = [];
fs.unlink(newCssPlace, ()=> {
  const fileItem = promises.readdir(dirPath, option);
  fileItem.then(files => files.forEach(file => {
    if (file.isFile()) {
        const pathFile = path.join(dirPath, file.name);
      if (file.name.slice(-3) === 'css') {
        const readable = fs.createReadStream(pathFile, 'utf-8');
        readable.on('data', data => {
            newCss.push(data);
        });
        readable.on('end', () => {
            writable.write(newCss.flat().join('\n'), 'utf-8');
        });
      }
    }
  }))
});

function copyAssets(dir, pathCopy) {
  mkdir(pathCopy, recursive).then(() => {
    readdir(dir).then((files) => {
      files.forEach(file => {
        let assetsFile = path.join(dir, file);
        let pathCopyFile = path.join(pathCopy, file);
        fs.stat(assetsFile, (err, stats) => {
          if (err) throw err;
          if (stats.isDirectory()) {
            copyAssets(assetsFile, pathCopyFile);
          } else {
            fs.createReadStream(assetsFile).pipe(fs.createWriteStream(pathCopyFile));
          }
        });
      });
    });
  });
}

copyAssets(path.join(__dirname, 'assets'), path.join(pathCopy, 'assets'));

function createHtml() {
    const pathToTemplate = path.resolve(__dirname, 'template.html');
    const template = fs.createReadStream(pathToTemplate, 'utf-8');
    const pathToNewHtml = path.resolve(__dirname, 'project-dist', 'index.html');
    template.on('data', data => {
      let newHtml = data.toString();
  
      const pathToComponents = path.resolve(__dirname, 'components');
      const objInFolder = promises.readdir(pathToComponents, option);
      objInFolder.then(files => files.forEach(file => {
      if (file.isFile()) {
        const pathToFile = path.resolve(__dirname, 'components', file.name);
        const wholeName = path.basename(pathToFile);
        const extention = path.extname(pathToFile);
        const name = wholeName.replace(extention, '');
        const template = fs.createReadStream(pathToFile, 'utf-8');
        template.on('data', data => {
          const output = fs.createWriteStream(pathToNewHtml);
          const component = data.toString();
          
          newHtml = newHtml.replace(`{{${name}}}`, component);
          output.write(newHtml);
        })
        }
      })
      )
    }) 
  }
  
createHtml();