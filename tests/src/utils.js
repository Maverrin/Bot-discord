module.exports = {
    /**
   * Recursive function to fetch all test files in folder
   * @param {String} path -
   * @return {Array} - paths
   */
    getAllTestFiles: (path) => {
        const {statSync, readdirSync} = require('fs');
        const {join} = require('path');

        const loop = (path) => {
            readdirSync(path).forEach(el => {
                const fullPath = join(path, el);
                const pathStats = statSync(fullPath);
                if (pathStats.isDirectory()) return loop(fullPath);
                else {
                    const splitPath = fullPath.split(/[\\/.]/g);
                    const fileName = splitPath[splitPath.length-2];

                    // ignore index.js files
                    if (['index'].includes(fileName)) return;
                    return filePaths.push(fullPath);
                }
            });
        };

        let filePaths = [];
        loop(path);
        return filePaths;
    },
};
