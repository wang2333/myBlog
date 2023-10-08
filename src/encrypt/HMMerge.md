---
title: 韩漫合并
icon: lock
article: false
---

# 韩漫合并

```javascript
const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');

const INPUT_DIR = './人妻獵人';
const OUTPUT_DIR = INPUT_DIR + '/output';
const THUMBNAIL_WIDTH = 300;

var imagemin = null;
var imageminPngquant = null;

const readFolders = async dir => {
  const files = await fs.promises.readdir(dir);
  const folders = files.filter(file => fs.lstatSync(path.join(dir, file)).isDirectory());
  return folders.map(folder => path.join(dir, folder));
};

const readFiles = async dir => {
  const files = await fs.promises.readdir(dir);
  const imageFiles = files.filter(
    file =>
      fs.lstatSync(path.join(dir, file)).isFile() &&
      path.extname(file).toLowerCase() === '.jpg' &&
      /^\d{3}\.jpg$/.test(file)
  );
  return imageFiles.sort().map(file => path.join(dir, file));
};

const createThumbnail = async file => {
  const image = await Jimp.read(file);
  return image.resize(THUMBNAIL_WIDTH, Jimp.AUTO);
};

const mergeImages = async files => {
  const images = await Promise.all(files.map(createThumbnail));
  const maxHeight = images.reduce((acc, img) => acc + img.getHeight(), 0);
  const width = THUMBNAIL_WIDTH;
  const height = maxHeight;
  const merged = new Jimp(width, height);

  let y = 0;
  for (const img of images) {
    merged.blit(img, 0, y);
    y += img.getHeight();
  }

  return merged;
};

const compressAndSaveImage = async (image, basename) => {
  // 压缩图片并获取压缩后的 Buffer
  const optimizedBuffer = await imagemin.buffer(await image.getBufferAsync(Jimp.MIME_PNG), {
    plugins: [imageminPngquant()]
  });

  // 将压缩后的 Buffer 写入文件
  await fs.promises.writeFile(
    path.join(OUTPUT_DIR, `${basename.split(' ')[0]}.png`),
    optimizedBuffer
  );
};

const main = async compressImages => {
  try {
    imagemin = (await import('imagemin')).default;
    imageminPngquant = (await import('imagemin-pngquant')).default;

    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR);
    }

    const folders = await readFolders(INPUT_DIR);
    console.log(`已找到${folders.length}个文件夹在${INPUT_DIR}`);
    for (const folder of folders) {
      const files = await readFiles(folder);
      if (files.length === 0) continue;

      const basename = path.basename(folder).split(' ')[0];
      const outputPath = path.join(OUTPUT_DIR, `${basename}.png`);

      // 如果输出文件已存在，则跳过当前文件夹的处理
      if (fs.existsSync(outputPath)) {
        console.log(`${basename}已存在，跳过`);
        continue;
      }
      const merged = await mergeImages(files);

      if (compressImages) {
        await compressAndSaveImage(merged, basename);
      } else {
        await merged.writeAsync(outputPath);
      }

      console.log(`已合并${files.length}张图片到${basename}`);
    }
  } catch (error) {
    console.error(`合并图片失败: ${error}`);
  }
};

const compressImages = process.argv[2] !== 'false';
main(compressImages);
```