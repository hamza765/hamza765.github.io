import http from 'http';
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import middleware from './middleware';
import api from './api';

var app = express();
app.server = http.createServer(app);

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/certificate_lookup', function(req, res, next) {

    var t = req.path;
    console.log(req.originalUrl + "-----------");
    if (req.originalUrl.match(/lookup\/./i) != null) {
        t = t.slice(1, t.length);
        t = "/?url=" + t;
        res.redirect(301, t);
    } else {
        res.redirect(301, '/');
    }
    next();
});

// app.use(function(req, res, next) {

//     var t = req.path + "-------------";
//     // if (!(t.match(/\/certificate_lookup/)) || !(t.match(/\/decoder/)) || !(t.match(/\//))) {
//     // 	res.redirect(301, '/404');
//     // }
//     console.log(t);
//     next();
// });

app.use(express.static('./client'));

// internal middleware
app.use(middleware());

// api router
app.use('/api', api());

app.server.listen(process.env.PORT || 8080);

console.log(`Started on port ${app.server.address().port}`);

export default app;
