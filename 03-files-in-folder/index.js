const fs = require('fs');
const promises = fs.promises;
const path = require('path');
const option = {withFileTypes: true};

const dirPath = path.join(__dirname, 'secret-folder');
const fileItem = promises.readdir(dirPath, option);

fileItem.then(files => files.forEach(file => {
  if (file.isFile()) {
    const filePath = path.join(__dirname, 'secret-folder', file.name);
    const info = promises.stat(filePath);
    const fileName = path.basename(filePath);
    const fileExt = path.extname(filePath);

    info.then(stat => {
      const name = fileName.replace(fileExt, '');
      const extention = fileExt.slice(1);
      const size = +(stat.size / 1024).toFixed(2);
      console.log(`file name: ${name}, extention: ${extention}, size: ${size}kb`);
    })
  }
}))