const gutil = require('gulp-util');
const through = require('through2');
const fs = require('fs');

module.exports = {
  myHtml: (options) => {
    return through.obj(function (file, enc, cb) {
      if (file.isNull()) {
        cb(null, file);
        return;
      }

      if (file.isStream()) {
        cb(new gutil.PluginError('gulp-example-plugin', 'Streaming not supported'));
        return;
      }

      fs.readFile(file.path, 'utf8', (error, data) => {
        let result = data.replace('class=', 'className=');

        while (result.search(/class=/) !== -1) {
          result = result.replace(/class=/, 'className=');
        }

        fs.writeFile(file.path, result, 'utf8', function (err) {
          if (err) return console.log(err);
        });
      });

      this.push(file);
      cb();
    });
  },
  myStyles: () => {
    return through.obj(function (file, enc, cb) {
      if (file.isNull()) {
        cb(null, file);
        return;
      }

      if (file.isStream()) {
        cb(new gutil.PluginError('gulp-example-plugin', 'Streaming not supported'));
        return;
      }

      fs.readFile(file.path, 'utf8', (error, data) => {
        let imports = data.split('//imports')[1];
        while (imports.search(/.\/[a-zA-Z]+\//) !== -1) {
          imports = imports.replace(/.\/[a-zA-Z]+\//, '');
        }
        const result = data.split('//imports')[0] + '//imports' + imports;
        fs.writeFile(file.path, result, 'utf8', function (err) {
          if (err) return console.log(err);
        });
      });

      this.push(file);
      cb();
    });
  },
};
