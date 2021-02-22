// jest-puppeteer.config.js
module.exports = {
    launch: {
        headless: false
    },
    browser: 'chromium',
    browserContext: 'default',
    server: {
        command: './node_modules/ts-node/dist/bin.js e2e/server.ts',
        port: 9898,
        launchTimeout: 10000,
        debug: true
    }
};