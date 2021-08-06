#!/usr/bin/env node
const basePath = process.argv[2]
const srcPath = process.argv[3]

const BASE_PATH = basePath ?? require('path').resolve(__dirname + '/../..') + '/'
const BASE_PATH_SRC = srcPath ?? BASE_PATH + 'src/'

const { check } = require("vue-type-check-hapyharshit");
const changedFiles = require('git-changed-files');
const watch = require('node-watch')

process.exit = () => {}

async function getChangedVueFiles() {
    const files = await changedFiles();
    return files['unCommittedFiles'].filter(file => file.endsWith('.vue')).map(file => BASE_PATH + file)
}

async function checkFiles(files) {
    await check({
        workspace: BASE_PATH,
        srcDir: BASE_PATH_SRC,
        files,
        onlyTemplate: true,
        failExit: false,
    })
}

async function checkChangedFiles() {
    const files = await getChangedVueFiles()
    await checkFiles(files)
}

const watcher = watch(BASE_PATH_SRC, {
    recursive: true,
    filter(f) {
        return /\.vue$/.test(f);
    }
});

watcher.on('change', async () => {
    console.log('Reprocessing...')
    await checkChangedFiles()
})

watcher.on('ready', async () => {
    console.log('Now watching!')
    await checkChangedFiles()
})