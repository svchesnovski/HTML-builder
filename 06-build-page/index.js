const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname);
const destDir = path.resolve(__dirname, 'project-dist');

// Рекурсивная функция для копирования директорий
const copyRecursive = (src, dest, callback) => {
  fs.mkdir(dest, { recursive: true }, (err) => {
    if (err) {
      callback(err);
      return;
    }
    fs.readdir(src, { withFileTypes: true }, (err, files) => {
      if (err) {
        callback(err);
        return;
      }
      const copyNext = (index) => {
        if (index === files.length) {
          callback(null);
          return;
        }
        const file = files[index];
        const srcPath = path.join(src, file.name);
        const destPath = path.join(dest, file.name);
        if (file.isDirectory()) {
          copyRecursive(srcPath, destPath, (err) => {
            if (err) {
              callback(err);
            } else {
              copyNext(index + 1);
            }
          });
        } else {
          fs.copyFile(srcPath, destPath, (err) => {
            if (err) {
              callback(err);
            } else {
              console.log(`Скопировано из ${srcPath} в ${destPath}`);
              copyNext(index + 1);
            }
          });
        }
      };
      copyNext(0);
    });
  });
};

// Создаем новую директорию для копирования файлов
fs.mkdir(destDir, { recursive: true }, (err) => {
  if (err) {
    console.error(err);
    return;
  }

  // Читаем содержимое файла template.html
  fs.readFile(path.join(srcDir, 'template.html'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    // Заменяем теги шаблона на содержимое компонентов
    const componentsDir = path.join(srcDir, 'components');
    const header = fs.readFileSync(
      path.join(componentsDir, 'header.html'),
      'utf8',
    );
    const articles = fs.readFileSync(
      path.join(componentsDir, 'articles.html'),
      'utf8',
    );
    const footer = fs.readFileSync(
      path.join(componentsDir, 'footer.html'),
      'utf8',
    );
    const html = data
      .replace('{{header}}', header)
      .replace('{{articles}}', articles)
      .replace('{{footer}}', footer);

    // Записываем содержимое в файл index.html
    fs.writeFile(path.join(destDir, 'index.html'), html, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('index.html был успешно создан!');
    });
  });

  // Компилируем стили из папки styles в один файл
  const stylesDir = path.join(srcDir, 'styles');
  const cssFiles = fs
    .readdirSync(stylesDir)
    .filter((file) => path.extname(file) === '.css');
  const styles = cssFiles
    .map((file) => fs.readFileSync(path.join(stylesDir, file), 'utf8'))
    .join('\n');
  fs.writeFile(path.join(destDir, 'style.css'), styles, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('style.css был успешно создан!');
  });

  // Копируем папку assets в project-dist
  const assetsDir = path.join(srcDir, 'assets');
  const destAssetsDir = path.join(destDir, 'assets');
  copyRecursive(assetsDir, destAssetsDir, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Assets были успешно скопированы!');
  });
});
