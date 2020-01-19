var express = require('express'),
    app = express(),
    path = require('path'),
    fs = require('fs'),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    port = process.env.PORT || 3000,
    colors = require('colors/safe');
    error = colors.red,
    warn = colors.yellow;

server.listen(port, () => {
    console.log(colors.black.bgGreen('Server listening at port %d\n'), port);
});


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

// Routing
app.get('/', function(req , res) {
    res.render('index', {
        title: 'Big Buck Bunny',
        videoPath: '/BigBuckBunny.mp4',
        videoPoster: '/BigBuckBunny_poster.jpg'
    });
});

app.get('/videos', function(req , res) {
    res.render('videos', {
        title: 'Videos',
        videos: getFilesFromDir('./public/videos/','.mp4')
    });
});

app.get('/videos/:video', function(req , res) {
    res.render('index', {
        title: req.params.video,
        videoPath: '/videos/' + req.params.video + '.mp4',
        videoPoster: ''
    });
});

var clients = [];

io.on('connection', (socket) => {
    console.log(colors.brightGreen('New Client with id: ' + socket.id + '\n'));

    if (clients.length > 0) {
        io.to(clients[0]).emit('ask status');
    }

    clients.push(socket.id);

    socket.on('play', () => {
        console.log(warn('Start playing\n'));
        io.emit('play');
    });

    socket.on('pause', () => {
        console.log(warn('Pause!!!\n'));
        io.emit('pause');
    });

    socket.on('answer status', (data) => {
        io.emit('sync players', data);
        console.log(warn('Sync Players => { paused: ' + data['paused'] + ', time: ' + data['currentTime'] + ' }\n'));
    });

    socket.on('disconnect', () => {
        clients.splice(clients.indexOf(socket.id), 1);
        console.log(error('Client ' + socket.id + ' is gone\n'));
    });
});

function getFilesFromDir(startPath, filter) {
    console.log('Starting from dir ' + startPath);

    if (!fs.existsSync(startPath)){
        console.log('no dir ' + startPath);
        return;
    }

    var foundFiles = [];

    var files=fs.readdirSync(startPath);
    for(var i=0;i<files.length;i++){
        var filename=path.join(startPath,files[i]);
        var stat = fs.lstatSync(filename);

        if (stat.isDirectory()){
            fromDir(filename,filter); //recurse
        }

        else if (filename.indexOf(filter) >= 0) {
            console.log('-- found: ' + filename);
            foundFiles.push(filename.replace('public','').replace('.mp4',''));
        };
    };

    return foundFiles;
};
