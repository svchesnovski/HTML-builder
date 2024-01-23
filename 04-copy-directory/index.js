const fs = require('fs').promises;
const path = require('path');

async function copyDir() {
  const srcDir = path.resolve(__dirname, 'files');
  const destDir = path.resolve(__dirname, 'files-copy');

  // Проверяем существует ли папка "files"
  try {
    await fs.access(srcDir);
  } catch (err) {
    console.error(`Папка ${srcDir} не существует`);
    return;
  }

  // Проверяем существует ли папка "files-copy" и создаем ее, если необходимо
  try {
    await fs.access(destDir);
  } catch (err) {
    await fs.mkdir(destDir, { recursive: true });
  }

  // Удаляем все файлы из "files-copy"
  try {
    const destFiles = await fs.readdir(destDir);
    const unlinkPromises = destFiles.map((file) =>
      fs.unlink(path.join(destDir, file)),
    );
    await Promise.all(unlinkPromises);
  } catch (err) {
    console.error('Ошибка при удалении файлов из "files-copy":', err);
  }

  // Копируем файлы из "files" в "files-copy"
  try {
    const files = await fs.readdir(srcDir);
    for (const file of files) {
      const srcPath = path.join(srcDir, file);
      const destPath = path.join(destDir, file);
      await fs.copyFile(srcPath, destPath);
      console.log(`Скопировано из ${srcPath} в ${destPath}`);
    }
    console.log('Содержимое "files-copy" обновлено.');
  } catch (err) {
    console.error('Ошибка при копировании файлов:', err);
  }
}

copyDir();
