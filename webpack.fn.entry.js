const glob = require("glob");
const path = require("path");

function entry(wildcardConfigs) {
    let entries = {};

    Object.values(wildcardConfigs).forEach(function (config) {
        let files = glob.sync(config.input);
        let map = getOutSrcMap(files, config);
        entries = Object.assign(entries, map);
    });

    return entries;
}

function getOutSrcMap(files, config) {
    let result = {};

    let match = config.input.match(/(.+?)(\/\*\*).+/);
    let sourcePref = match ? match[1] : null;

    Object.values(files).forEach(function (entryPath) {
        let basename = path.basename(entryPath);
        let ext = path.extname(basename);
        let extMap = {
            ".scss": ".css"
        }
        let filename = basename.replace(ext, '');
        if(typeof extMap[ext] !== 'undefined') {
            ext = extMap[ext];
        }

        let nestingDir = path.sep;
        if(sourcePref) {
            nestingDir = entryPath.replace(sourcePref, '').replace(basename,'');
        }

        let outpath = `${config.output}${nestingDir}${filename.replace(ext, '')}`;
        result[outpath] = entryPath;
    });
    return result;
}

module.exports = entry;