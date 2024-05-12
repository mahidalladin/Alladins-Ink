
var SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

if (SpeechRecognition) {
  var recognition = new SpeechRecognition();
  var textbox = document.querySelector('#textbox2');
  var startBtn = document.querySelector('#start-btn1');
  var submitBtn = document.querySelector('#submit-btn1');
  var instructions = document.querySelector('#instructions1');

  var content = ""; // Variable to store the content
  var isRecording = false;

  recognition.continuous = true;

  function updateButtonState(recording) {
    if (recording) {
        startBtn.innerHTML= "Pause";
      instructions.textContent = "Recording in progress.";
    } else {
        startBtn.innerHTML= "Resume";
      instructions.textContent = "Recording paused.";
    }
    isRecording = recording;
  }

  recognition.onstart = function () {
    updateButtonState(true);
  };

  recognition.onend = function () {
    updateButtonState(false);
  };

  recognition.onresult = function (event) {
    var interimTranscript = "";
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        content += event.results[i][0].transcript + ' '; // Append final transcript to content
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }
    textbox.value = content + interimTranscript; // Update textbox with both final and interim text
  };

  recognition.onerror = function (event) {
    instructions.textContent = "Error: " + event.error;
  };

  startBtn.addEventListener('click', function () {
    if (isRecording) {
        
      recognition.stop();
    } else {
      content = textbox.value; // Store current content before starting new recording
      recognition.start();
    }
  });

  //   submitBtn.addEventListener('click', function () {
  //     // Implement your submission logic here
  //     alert('Recording submitted: ' + content);
  //   });

} else {
  instructions.textContent = "Speech recognition is not supported in this browser.";
}