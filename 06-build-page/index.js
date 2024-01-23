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

// Динамически заменяем шаблоны на содержимое компонентов
const replaceTemplates = async (content, componentsDir) => {
  const templateRegex = /\{\{([^}]+)\}\}/g;

  let match;
  while ((match = templateRegex.exec(content)) !== null) {
    const templateName = match[1].trim();
    const componentPath = path.join(componentsDir, `${templateName}.html`);

    try {
      const componentContent = await fs.readFile(componentPath, 'utf8');
      content = content.replace(match[0], componentContent);
    } catch (error) {
      console.error(`Не удалось найти компонент с именем ${templateName}`);
    }
  }

  return content;
};

// Создаем новую директорию для копирования файлов
(async () => {
  await fs.mkdir(destDir, { recursive: true });

  // Читаем содержимое файла template.html
  const templatePath = path.join(srcDir, 'template.html');
  const templateContent = await fs.readFile(templatePath, 'utf8');

  // Читаем содержимое компонентов
  const componentsDir = path.join(srcDir, 'components');

  // Заменяем шаблоны на содержимое компонентов
  const replacedContent = await replaceTemplates(
    templateContent,
    componentsDir,
  );

  // Записываем содержимое в файл index.html
  await fs.writeFile(path.join(destDir, 'index.html'), replacedContent);
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
