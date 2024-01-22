const fs = require('fs').promises;
const path = require('path');

const stylesDir = path.resolve(__dirname, 'styles');
const bundleFile = path.resolve(__dirname, 'project-dist', 'bundle.css');

fs.readdir(stylesDir)
  .then((files) => {
    const cssFiles = files.filter((file) => path.extname(file) === '.css');

    return Promise.all(
      cssFiles.map((file) => {
        const filePath = path.join(stylesDir, file);
        return fs.readFile(filePath, 'utf8');
      }),
    ).then((contents) => {
      const styles = contents.join('\n');
      // Создаем директорию project-dist, если её еще нет
      return fs
        .mkdir(path.dirname(bundleFile), { recursive: true })
        .then(() => fs.writeFile(bundleFile, styles))
        .then(() =>
          console.log(
            `Скомпилировано ${cssFiles.length} css документа в ${bundleFile}`,
          ),
        );
    });
  })
  .catch((err) => {
    console.error(err);
  });
