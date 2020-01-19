let socket = io();
let video = document.getElementsByTagName('video')[0];

function play_pause() {
  socket.emit((video.paused ? 'play' : 'pause'));
}

socket.on('play', function(data) {
  video.play();
});

socket.on('pause', function(data) {
  video.pause();
});

socket.on('ask status', function(data) {
  socket.emit('answer status', { paused: video.paused, currentTime: video.currentTime });
});

socket.on('sync players', function(data) {
  video.currentTime = data['currentTime'];
  socket.emit((data['paused'] ? 'pause' : 'play'));

  if (data['paused']) {
    video.pause();
    video.load();
  }

  else {
    video.play();
  }
});
