const fs = require('fs').promises;
const path = require('path');

const srcDir = path.resolve(__dirname);
const destDir = path.resolve(__dirname, 'project-dist');

// Рекурсивная функция для копирования директорий
const copyRecursive = async (src, dest) => {
  await fs.mkdir(dest, { recursive: true });

  const files = await fs.readdir(src, { withFileTypes: true });

  const copyNext = async (index) => {
    if (index === files.length) {
      return;
    }

    const file = files[index];
    const srcPath = path.join(src, file.name);
    const destPath = path.join(dest, file.name);

    if (file.isDirectory()) {
      await copyRecursive(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
      console.log(`Скопировано из ${srcPath} в ${destPath}`);
    }

    await copyNext(index + 1);
  };

  await copyNext(0);
};

// Создаем новую директорию для копирования файлов
(async () => {
  await fs.mkdir(destDir, { recursive: true });

  // Читаем содержимое файла template.html
  const data = await fs.readFile(path.join(srcDir, 'template.html'), 'utf8');

  // Заменяем теги шаблона на содержимое компонентов
  const componentsDir = path.join(srcDir, 'components');
  const header = await fs.readFile(
    path.join(componentsDir, 'header.html'),
    'utf8',
  );
  const articles = await fs.readFile(
    path.join(componentsDir, 'articles.html'),
    'utf8',
  );
  const footer = await fs.readFile(
    path.join(componentsDir, 'footer.html'),
    'utf8',
  );
  const html = data
    .replace('{{header}}', header)
    .replace('{{articles}}', articles)
    .replace('{{footer}}', footer);

  // Записываем содержимое в файл index.html
  await fs.writeFile(path.join(destDir, 'index.html'), html);
  console.log('index.html был успешно создан!');

  // Компилируем стили из папки styles в один файл
  const stylesDir = path.join(srcDir, 'styles');
  const cssFiles = (await fs.readdir(stylesDir)).filter(
    (file) => path.extname(file) === '.css',
  );
  const styles = (
    await Promise.all(
      cssFiles.map((file) => fs.readFile(path.join(stylesDir, file), 'utf8')),
    )
  ).join('\n');

  await fs.writeFile(path.join(destDir, 'style.css'), styles);
  console.log('style.css был успешно создан!');

  // Копируем папку assets в project-dist
  const assetsDir = path.join(srcDir, 'assets');
  const destAssetsDir = path.join(destDir, 'assets');
  await copyRecursive(assetsDir, destAssetsDir);
  console.log('Assets были успешно скопированы!');
})();
