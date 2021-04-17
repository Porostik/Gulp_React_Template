const { src, dest, parallel, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const scss = require('gulp-sass');
const autoPrefixer = require('gulp-autoprefixer');
const imageMin = require('gulp-imagemin');
const fs = require('fs');
const { myHtml, myStyles } = require('./utils/plagin');
const { getTemplate, createStyles } = require('./utils/template');

const currentFile = process.argv[process.argv.findIndex((item) => item === '--file') + 1];

const filePath = `./src/${currentFile}/${currentFile}.html`;
createStyles();
if (!fs.existsSync(`./src/${currentFile}`)) {
  const template = getTemplate();
  fs.mkdirSync(`./src/${currentFile}/`);
  fs.writeFileSync(filePath, template);
  fs.writeFileSync(`./src/${currentFile}/${currentFile}.scss`, '');
  fs.appendFileSync('./src/app.scss', `\n@import './${currentFile}/${currentFile}';`);
}

function browsersync() {
  browserSync.init({
    server: { baseDir: `src`, index: `${currentFile}/${currentFile}.html` },
    online: false,
    notify: false,
  });
}

function html() {
  return src(`src/${currentFile}/${currentFile}.html`)
    .pipe(myHtml())
    .pipe(dest(`dist/${currentFile}`))
    .pipe(browserSync.stream());
}

function stylesApp() {
  return src('src/app.scss')
    .pipe(scss())
    .pipe(concat('style.min.css'))
    .pipe(dest('src'))
    .pipe(browserSync.stream());
}

function stylesApp2() {
  return src('src/app.scss').pipe(myStyles()).pipe(dest('dist/styles')).pipe(browserSync.stream());
}

function stylesCurrent() {
  return src(`src/${currentFile}/${currentFile}.scss`)
    .pipe(dest('dist/styles'))
    .pipe(browserSync.stream());
}

function images() {
  return src('src/img/**/*').pipe(imageMin()).pipe(dest('dist/img'));
}

function startWatching() {
  watch([`src/${currentFile}/${currentFile}.scss`], stylesCurrent);
  watch([`src/*/**.scss`], stylesApp);
  watch([`src/app.scss`], stylesApp2);
  watch([`src/${currentFile}/${currentFile}.html`], html);
  watch(['src/img'], images);
}

exports.default = parallel(
  images,
  html,
  stylesApp,
  stylesApp2,
  stylesCurrent,
  browsersync,
  startWatching,
);
