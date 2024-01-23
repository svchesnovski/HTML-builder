const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'text.txt');

const readMyFile = fs.createReadStream(filePath, 'utf8');

readMyFile.on('data', (chunk) => {
  console.log(chunk);
});

readMyFile.on('end', () => {
  console.log('Файл прочтен');
});

readMyFile.on('error', (err) => {
  console.error(err);
});
