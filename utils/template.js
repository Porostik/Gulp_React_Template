const fs = require('fs');

module.exports = {
  getTemplate: () => {
    const templateData = fs.readFileSync('./utils/template.html', 'utf8');
    return templateData;
  },
  createStyles: () => {
    if (!fs.existsSync(`./src/app.scss`)) {
      fs.writeFileSync(`./src/app.scss`, '//imports');
    }
  },
};
