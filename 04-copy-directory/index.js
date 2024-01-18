const fs = require("fs/promises");
const path = require("path");

const option = {withFileTypes: true};
const recursive = {recursive: true};

const pathDir = path.join(__dirname, 'files');
const pathDirCopy = path.join(__dirname, 'files-copy');

fs.rm(pathDirCopy, {
  recursive: true,
  force: true,
}).finally(function() {
  fs.mkdir(pathDirCopy, recursive);
  fs.readdir(pathDir, option)
    .then(files => {
      files.forEach(file => {
        if (file.isFile()) {
          let pathFile = path.join(pathDir, file.name);
          let pathFileCopy = path.join(pathDirCopy, file.name);
          fs.copyFile(pathFile, pathFileCopy);
        } 
      });
    });
}); 

console.log('\nDirectory is copied successfully\n');