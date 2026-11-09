'use strict';

// This script only controls the optional video. It sends no call-click analytics.
const video = document.querySelector('[data-video-id]');
if (video) {
  const stage = document.getElementById('video-stage');
  const play = document.getElementById('video-play');
  const close = document.getElementById('video-close');
  const id = video.dataset.videoId;
  let frame;

  function closeVideo() {
    if (!frame) return;
    frame.remove();
    frame = undefined;
    stage.classList.remove('is-playing');
    play.hidden = false;
    close.hidden = true;
    play.focus();
  }

  play.addEventListener('click', () => {
    if (frame || !/^[A-Za-z0-9_-]{11}$/.test(id)) return;
    frame = document.createElement('iframe');
    frame.src = 'https://www.youtube-nocookie.com/embed/' + id +
      '?autoplay=1&rel=0&playsinline=1&cc_load_policy=1';
    frame.title = 'Featured final expense insurance video';
    frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.allowFullscreen = true;
    play.hidden = true;
    close.hidden = false;
    stage.classList.add('is-playing');
    stage.append(frame);
    frame.focus();
  });

  close.addEventListener('click', closeVideo);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && frame) closeVideo();
  });
}
