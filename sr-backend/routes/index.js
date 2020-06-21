const path = require('path');
const files = require('file-system');

module.exports.attachRoutes = server => {
    const routesPath = path.join(process.cwd(), 'routes');

    try {
        if (files.fs.existsSync(routesPath)) {
            if (files.fs.lstatSync(routesPath).isDirectory()) {
                files.recurseSync(routesPath, ['**/*.js', '!index.js'], (filepath, relative, filename) => {
                    require(filepath)(server);
                });
            } else {
                console.log(`"${routesPath}" is not a directory.`);
            }
        } else {
            console.log(`"${routesPath}" does not exist.`);
        }
    } catch (e) {
        console.log(e);
    }
};