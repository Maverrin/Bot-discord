const chai = require('chai');
const discordMock = require('../mocks/discord');

const {getAllTestFiles} = require('./utils');
const {join} = require('path');

describe('setup', function () {
    before(async function () {
        // SETUP TEST ENV
        Object.assign(this, {
            expect : chai.expect,
            discord: new discordMock(),
        });
    });


    describe('Unit tests', function () {
        const filepaths = getAllTestFiles(join(__dirname, 'unit'));

        for (const filepath of filepaths) require(filepath);
    });


    after(async function () {
        console.log('=== Tests finished');
    });
});
