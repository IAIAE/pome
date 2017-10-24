#!/usr/bin/env node
'use strict'

var command = process.argv[2]
switch (command) {
    case '-h':
    case 'help':
        require('../dist/cmd/help')()
        break
    default:
        require('../dist/cmd/main')()
}


