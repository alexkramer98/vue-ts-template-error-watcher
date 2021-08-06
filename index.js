#!/usr/bin/env node
const basePath = process.argv[2]
const srcPath = process.argv[3]

const BASE_PATH = basePath ?? require('path').resolve(__dirname + '/../..') + '/'
const BASE_PATH_SRC = srcPath ?? BASE_PATH + 'src/'

const { check } = require("vue-type-check-hapyharshit")
const watch = require('node-watch')
const exec = require('util').promisify(require('child_process').exec)
const EOL = require('os').EOL

process.exit = () => {}

async function getChangedVueFiles() {
    try {
        const { stdout } = await exec('git diff --name-only --diff-filter=ACMRTUXB | grep -E "(.vue$)"')
        return stdout.split(EOL).filter(fileName => fileName).map(fileName => BASE_PATH + fileName)
    } catch (error){}
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
    if (!files) {
        return
    }
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