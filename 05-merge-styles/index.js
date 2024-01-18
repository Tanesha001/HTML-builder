const fs = require('fs');
const promises = fs.promises;
const path = require('path');
const option = {withFileTypes: true};

const dirPath = path.join(__dirname, 'styles');
const newCssPlace = path.join(__dirname, 'project-dist', 'bundle.css');

const writable = fs.createWriteStream(newCssPlace, 'utf-8');
const bundleCss = [];
fs.unlink(newCssPlace, ()=> {
  const fileItem = promises.readdir(dirPath, option);
  fileItem.then(files => files.forEach(file => {
    if (file.isFile()) {
        const pathFile = path.join(dirPath, file.name);
      if (file.name.slice(-3) === 'css') {
        const readable = fs.createReadStream(pathFile, 'utf-8');
        readable.on('data', data => {
            bundleCss.push(data);
        });
        readable.on('end', () => {
            writable.write(bundleCss.flat().join('\n'), 'utf-8');
        });
      }
    }
  }))
});
console.log('Styles were merged successfully');