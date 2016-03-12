// https://github.com/christophercliff/watch-ignore-webpack-plugin

function IgnoringWatchFileSystem(wfs, paths) {
  this.wfs = wfs;
  this.paths = paths;
}

IgnoringWatchFileSystem.prototype.watch = function (files, dirs, missing, startTime, delay, callback, callbackUndelayed) {
  const ignored = function (path) {
    return this.paths.some(function (p) {
      return path.indexOf(p) === 0;
    });
  }.bind(this);

  const notIgnored = function (path) {
    return !ignored(path);
  };

  const ignoredFiles = files.filter(ignored);
  const ignoredDirs = dirs.filter(ignored);

  this.wfs.watch(files.filter(notIgnored), dirs.filter(notIgnored), missing, startTime, delay, function (err, filesModified, dirsModified, fileTimestamps, dirTimestamps) {
    if (err) {
      return callback(err);
    }

    ignoredFiles.forEach(function (path) {
      fileTimestamps[path] = 1;
    });

    ignoredDirs.forEach(function (path) {
      dirTimestamps[path] = 1;
    });

    callback(err, filesModified, dirsModified, fileTimestamps, dirTimestamps);
  }, callbackUndelayed);
};

function WatchIgnorePlugin(paths) {
  this.paths = paths;
}

WatchIgnorePlugin.prototype.apply = function (compiler) {
  compiler.plugin('after-environment', function () {
    compiler.watchFileSystem = new IgnoringWatchFileSystem(compiler.watchFileSystem, this.paths);
  }.bind(this));
};

module.exports = WatchIgnorePlugin;
