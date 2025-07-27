import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';
import imageminPngquant from 'imagemin-pngquant';
import imageminMozjpeg from 'imagemin-mozjpeg';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const inputDir = path.resolve('images'); // Source images directory (to be created by user)
const outputDir = path.resolve('optimized-images'); // Output directory for optimized images

const sizes = [320, 640, 1280]; // widths for responsive images

async function optimizeImages() {
  if (!fs.existsSync(inputDir)) {
    console.error(`Input directory "${inputDir}" does not exist. Please add images to optimize.`);
    process.exit(1);
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const files = fs.readdirSync(inputDir).filter(file => /\.(png|jpe?g)$/i.test(file));

  for (const file of files) {
    const inputFile = path.join(inputDir, file);
    const ext = path.extname(file).toLowerCase();
    const baseName = path.basename(file, ext);

    for (const size of sizes) {
      const outputFileName = `${baseName}-${size}${ext}`;
      const outputFilePath = path.join(outputDir, outputFileName);

      await sharp(inputFile)
        .resize(size)
        .toFile(outputFilePath);

      // Convert to WebP
      const webpFileName = `${baseName}-${size}.webp`;
      const webpFilePath = path.join(outputDir, webpFileName);

      await sharp(inputFile)
        .resize(size)
        .webp({ quality: 75 })
        .toFile(webpFilePath);
    }
  }

  console.log('Responsive image optimization complete. Optimized images are in:', outputDir);
}

optimizeImages().catch(err => {
  console.error('Error optimizing images:', err);
  process.exit(1);
});
