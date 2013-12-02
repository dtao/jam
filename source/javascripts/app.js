window.addEventListener('load', function() {

  var sounds       = {},
      soundsLoaded = 0,
      soundsToLoad = [
        ['kick', 'alchemist/AlchemistKick1.wav'],
        ['snare', 'alchemist/AlchemistSnare4.wav'],
        ['hi-hat', 'alchemist/AlchemistHiHat4.wav']
      ];

  function displayError(error) {
    alert(error);
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

  function playSound(soundKey) {
    var source = context.createBufferSource();
    source.buffer = sounds[soundKey];
    source.connect(context.destination);
    source.start(0);
  }

  var context = getAudioContext();

  loadSoundSamples();

  Mousetrap.bind('space', function() {
    playSound('kick');
  });

  Mousetrap.bind('a', function() {
    playSound('snare');
  });

  Mousetrap.bind('shift', function() {
    playSound('hi-hat');
  });

});
