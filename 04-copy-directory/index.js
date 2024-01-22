const fs = require('fs').promises;
const path = require('path');

async function copyDir() {
  const srcDir = path.resolve(__dirname, 'files');
  const destDir = path.resolve(__dirname, 'files-copy');

  // Создаем новую директорию для копирования файлов
  try {
    await fs.access(destDir);
  } catch (err) {
    await fs.mkdir(destDir, { recursive: true });
  }

  // Копируем файлы из исходной директории в новую директорию
  const files = await fs.readdir(srcDir);
  for (const file of files) {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);

    await fs.copyFile(srcPath, destPath);
    console.log(`Скопировано из ${srcPath} в ${destPath}`);
  }

  // Отслеживаем изменения в файлах в исходной директории и обновляем их если требуется в новой директории
  fs.watch(srcDir, { recursive: true }, async (eventType, filename) => {
    if (filename) {
      const srcPath = path.join(srcDir, filename);
      const destPath = path.join(destDir, filename);

      await fs.copyFile(srcPath, destPath);
      console.log(`Папка files-copy обнавлена${destPath}`);
    }
  });
}

copyDir();
