window.addEventListener('load', function() {

  var sounds       = {},
      soundsLoaded = 0,
      soundsToLoad = [
        ['kick', 'alchemist/AlchemistKick1.wav'],
        ['snare', 'alchemist/AlchemistSnare4.wav'],
        ['hi-hat', 'alchemist/AlchemistHiHat4.wav']
      ],
      recording = false,
      startRecording,
      currentStream = [],
      playButton = document.getElementById('play'),
      recordButton = document.getElementById('record');

  function displayError(error) {
    alert(error);
  }

  function showRecording(recording) {
    if (recording) {
      playButton.disabled = true;
      recordButton.disabled = true;
      recordButton.textContent = 'Recording';
    } else {
      playButton.disabled = false;
      recordButton.disabled = false;
      recordButton.textContent = 'Record';
    }
  }

  function getAudioContext() {
    try {
      return new (this.AudioContext || this.webkitAudioContext);
    } catch (e) {
      displayError('Unable to initialize audio context: ' + e);
    }
  }

  function loadSoundSamples() {
    soundsToLoad.forEach(function(sound) {
      var soundKey = sound[0],
          soundSrc = sound[1];

      var request = new XMLHttpRequest();
      request.open('GET', '/sounds/' + soundSrc);
      request.responseType = 'arraybuffer';

      request.addEventListener('load', function() {
        context.decodeAudioData(request.response, function(buffer) {
          sounds[soundKey] = buffer;
        });
      });

      request.send();
    });
  }

  function playSound(soundKey, start) {
    if (recording) {
      currentStream.push({
        time: context.currentTime - startedRecording,
        sound: soundKey
      });
    }

    var source = context.createBufferSource();
    source.buffer = sounds[soundKey];
    source.connect(context.destination);
    source.start(start || 0);
  }

  function startPlaying() {
    if (currentStream.length === 0) {
      return;
    }

    var start = context.currentTime;
    currentStream.forEach(function(sound) {
      playSound(sound.sound, start + sound.time);
    });
  }

  function startRecording() {
    if (!recording) {
      recording = true;
      startedRecording = context.currentTime;
      currentStream = [];

    } else {
      recording = false;
    }

    showRecording(recording);
  }

  function bindKey(keyCode, callback) {
    document.addEventListener('keydown', function(e) {
      if (e.keyCode === keyCode) {
        callback();
      }
    });
  }

  function bindKeyToSound(keyCode, sound) {
    bindKey(keyCode, function() {
      playSound(sound);
    });
  }

  var context = getAudioContext();

  loadSoundSamples();

  bindKey(82, startRecording);
  bindKeyToSound(32, 'kick');
  bindKeyToSound(65, 'snare');
  bindKeyToSound(16, 'hi-hat');

  playButton.addEventListener('click', startPlaying);
  recordButton.addEventListener('click', startRecording);

});
