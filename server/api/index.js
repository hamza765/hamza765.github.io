import { Router } from 'express';

import fs from 'fs';
import child_process from 'child_process';
var crypto = require('crypto');
const exec = child_process.exec;

export default function() {
    // Initialize our router
    let router = Router();

    // Middleware to use for all requests
    router.use(function(req, res, next) {
        // Do logging
        console.log('Something is happening.');
        next();
    });

    

    // Test route to make sure everything is working (accessed at GET http://localhost:8080/api)
    router.get('/', function(req, res) {
        res.json({ message: 'welcome to our api!' });
    });

    return router;
}
