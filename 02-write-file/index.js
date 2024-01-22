const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const filePath = path.resolve(__dirname, '02-write-file.txt');

rl.setPrompt('Введите текст: ');
rl.prompt();

rl.on('line', (input) => {
  fs.appendFile(filePath, input + '\n', (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`Текст "${input}" успешно записан в файл.`);
    rl.prompt();
  });
});

rl.on('close', () => {
  console.log('До новых встреч!');
  process.exit(0);
});
