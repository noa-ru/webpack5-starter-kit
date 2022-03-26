const fs = require("fs");
const path = require("path");

module.exports = class Hashmap {
    constructor(options) {
        this.options = options;
        this.jsmap_data = {};
        this.cssmap_data = {};
        this.assetsmap_data = {}; //regex
    }

    apply(compiler) {
        compiler.hooks.done.tap("Hashmap", (stats) => {

            stats.compilation.assetsInfo.forEach((value, key) => {
                let ext = path.extname(key);
                let filename = key.replace(`.${value.contenthash}`, '');

                if(ext === '.js') {
                    this.jsmap_data[filename] = key;
                } else if (ext === '.css') {
                    this.cssmap_data[filename] = key;
                } else if (this.options.assetsRegex){
                    let match = ext.match(this.options.assetsRegex);
                    if(match) {
                        this.assetsmap_data[filename] = key;
                    }
                }
            })

            fs.writeFile(
                `${this.options.hashMapPath}${path.sep}jsmap.json`,
                JSON.stringify(this.jsmap_data, null, 4),
                function (err) {
                    err ? console.error(`js-map write error: ${err}`) : null;
                }
            );
            fs.writeFile(
                `${this.options.hashMapPath}${path.sep}cssmap.json`,
                JSON.stringify(this.cssmap_data, null, 4),
                function (err) {
                    err ? console.error(`css-map write error: ${err}`) : null;
                }
            );
            fs.writeFile(
                `${this.options.hashMapPath}${path.sep}assets.json`,
                JSON.stringify(this.assetsmap_data, null, 4),
                function (err) {
                    err ? console.error(`assets write error: ${err}`) : null;
                }
            );
        });
    }

};