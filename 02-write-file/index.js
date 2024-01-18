const fs = require('fs');
const path = require('path');
const process = require('process');

const route = path.join(__dirname, '.result.txt');
const {stdin, stdout} = process;
const writeStream = fs.createWriteStream(route, 'utf-8');
console.log('Write down your text:\n');

stdin.on('data', data => {
  if (data.toString().trim() === 'exit') {
    process.exit();
  }
  else {
    writeStream.write(data, 'utf-8');
  }
});

process.addListener('SIGINT', ()=> {
  process.exit();
});

process.addListener('exit', ()=> {
  console.log(' \nRecording is completed\n');
});