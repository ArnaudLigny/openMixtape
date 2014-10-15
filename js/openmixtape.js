/**
 * openMixtape main script
 *
 * @see http://narno.org/openMixtape
 * Copyright 2014 Arnaud Ligny
 * http://opensource.org/licenses/MIT
 */
$(function() {
  console.log('load openmixtape.js');
  /* Visual effects */
  $('ol li').mouseover(function(e) {
    $(this).addClass('hover');
  });
  $('ol li').mouseout(function(e) {
    $(this).removeClass('hover');
  });
  /* Time formatting */
  function formatTime(seconds) {
    var hours = parseInt(seconds / 3600, 10) % 24;
    var minutes = parseInt(seconds / 60, 10) % 60;
    var secs = parseInt(seconds % 60, 10);
    var result, fragment = (minutes < 10 ? "0" + minutes : minutes) + ":" + (secs < 10 ? "0" + secs : secs);
    if (hours > 0) {
      result = (hours < 10 ? "0" + hours : hours) + ":" + fragment;
    } else {
      result = fragment;
    }
    return result;
  }
  function formatTimeShort(seconds) {
    var minutes = parseInt(seconds / 60, 10) % 60;
    var secs = parseInt(seconds % 60, 10);
    var result, fragment = (minutes < 1 ? "" : (minutes < 10 ? "" + minutes : minutes) + ":") + (secs < 10 ? (minutes < 1 ? "" : "0") + secs : secs);
    result = fragment;
    return result;
  }
  /* Audio player, powered by audio5js */
  var audio5;
  audio5 = new Audio5js({
    swf_path: 'swf/audio5js.swf',
    throw_errors: false,
    format_time: false,
    ready: function(player) {
      /* Loading a track on click */
      $('ol li').click(function(e) {
        e.preventDefault();
        audio5.pause();
        if ($(this).hasClass('playing') === false) {
          audio5.on('canplay', function() {
            audio5.play();
          }, this);
          audio5.load($('a', this).attr('data-src'));
        }
        $(this).addClass('playing').siblings().removeClass('playing');
        audio5.playPause();
      });
      /* Autoplay the next track */
      this.on('ended', function(){
        var next = $('ol li.playing').next();
        if (!next.length) next = $('ol li').first();
        next.addClass('playing').siblings().removeClass('playing');
        this.load($('a', next).attr('data-src'));
        this.play();
      }, this);
      /* Loading progress */
      this.on('progress', function(load_percent) {
        $('ol li > .info .loaded').html('');
        $('ol li.playing > .info .loaded').html(parseInt(load_percent) + ' %');
      }, this);
      /* Play or Pause? */
      this.on('play', function() {
        $('ol li.playing > .clock').html('&mdash;');
        $('ol li.playing > .clock').removeClass('grey');
        $('ol li.playing > .clock').addClass('green');
      }, this);
      this.on('pause', function() {
        $('ol li.playing > .clock').removeClass('green');
        $('ol li.playing > .clock').addClass('grey');
      }, this);
      /* Time update */
      this.on('timeupdate', function(position, duration) {
        $('ol li.playing > .info strong').html(formatTime(audio5.duration));
        $('ol li > .clock').html('');
        $('ol li.playing > .clock').html(formatTimeShort(position));
      }, this);
      /* Log */
      this.on('play', function() {
        console.log('play');
      }, this);
      this.on('pause', function() {
        console.log('pause');
      }, this);
      this.on('ended', function() {
        console.log('ended');
      }, this);
      this.on('progress', function(load_percent) {
        console.log('load: ' + load_percent + '%');
      }, this);
      this.on('error', function(error) {
        console.log('error: ' + error.message);
      }, this);
    }
  });
});