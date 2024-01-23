const fs = require('fs');
const path = require('path');

async function copyDir() {
  const srcDir = path.resolve(__dirname, 'files');
  const destDir = path.resolve(__dirname, 'files-copy');

  // Создаем новую директорию для копирования файлов
  try {
    await fs.promises.access(destDir);
  } catch (err) {
    await fs.promises.mkdir(destDir, { recursive: true });
  }

  // Копируем файлы из исходной директории в новую директорию
  const files = await fs.promises.readdir(srcDir);
  for (const file of files) {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);

    await fs.promises.copyFile(srcPath, destPath);
    console.log(`Скопировано из ${srcPath} в ${destPath}`);
  }

  // Отслеживаем изменения в файлах в исходной директории и обновляем их если требуется в новой директории
  fs.watch(srcDir, { recursive: true }, async (eventType, filename) => {
    if (filename) {
      const srcPath = path.join(srcDir, filename);
      const destPath = path.join(destDir, filename);

      if (eventType === 'rename') {
        try {
          await fs.promises.access(srcPath);
          await fs.promises.copyFile(srcPath, destPath);
          console.log(`Файл ${srcPath} скопирован в ${destPath}`);
        } catch (err) {
          await fs.promises.unlink(destPath);
          console.log(`Файл ${destPath} удален`);
        }
      } else if (eventType === 'change') {
        await fs.promises.copyFile(srcPath, destPath);
        console.log(`Файл ${destPath} обновлен`);
      } else if (eventType === 'unlink') {
        try {
          await fs.promises.unlink(destPath);
          console.log(`Файл ${destPath} удален`);
        } catch (err) {
          console.error(`Не удалось удалить файл ${destPath}:`, err);
        }
      }
    }
  });
}

copyDir();
