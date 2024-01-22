const fs = require('fs');
const path = require('path');

const folderPath = path.resolve(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  files.forEach((file) => {
    if (file.isFile()) {
      const fileName = path.parse(file.name).name;
      const fileExt = path.parse(file.name).ext.slice(1);

      fs.stat(path.join(folderPath, file.name), (err, stats) => {
        if (err) {
          console.error(err);
          return;
        }

        const fileSize = stats.size;

        console.log(`${fileName}-${fileExt}-${fileSize} bytes`);
      });
    }
  });
});
