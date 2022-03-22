// jest-puppeteer.config.js
module.exports = {
    launch: {
        headless: false,
        product: 'chrome'
    },
    browserContext: 'default',
    server: {
        command: './node_modules/ts-node/dist/bin.js e2e/server.ts',
        port: 9898,
        launchTimeout: 80000,
        debug: true
    }
};