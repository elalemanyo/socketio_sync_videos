(function() {
  let screenWidth = window.screen.width,
      screenHeight = window.screen.height,
      allVideos = document.querySelectorAll('.video__link'),
      videoWidth = screenWidth / allVideos.length,
      videoHeight = videoWidth / (16/9),
      videoTopPosition = (screenHeight/2) - (videoHeight/2);

  allVideos.forEach(item => {
    item.addEventListener('click', event => {
      event.preventDefault();

      let href = item.href;
      window.open(href, href, 'menubar=no, location=no, toolbar=no, scrollbars=yes, width='+ videoWidth +', height=' + videoHeight);
    });
  });

  document.querySelectorAll('.open-all').forEach(item => {
    item.addEventListener('click', event => {
      event.preventDefault();

      let count = 0;
      allVideos.forEach(video => {
        let href = video.href;
        window.open(href, href, 'menubar=no, location=no, toolbar=no, scrollbars=yes, width='+ videoWidth +', height='+ videoHeight +', top='+ videoTopPosition +', left='+ videoWidth*count);

        count++;
      });
    });
  });
})();
