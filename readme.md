This package provides a node binary which constantly checks for type errors in the  of Vue (2.x) files.

You can run this watcher next to the "serve" command provided by vue-cli.

It will only scan git changed files.

Usage: `vtstew [{basePath} {srcPath}]`.

If no basePath is provided it will default to `{current directory}/../..`. This is your project root.
If no srcPath is provided it will default to `basePath + '/src'`. This is the folder where the Vue files live.

When using a vue-cli created project you can leave these arguments out.