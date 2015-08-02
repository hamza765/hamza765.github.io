// Store frame for motion functions
var previousFrame = null;
var paused = false;
var pauseOnGesture = false;

// Setup Leap loop with frame callback function
var controllerOptions = {enableGestures: true};

// to use HMD mode:
// controllerOptions.optimizeHMD = true;

Leap.loop(controllerOptions, function(frame) {
  

  // Display Frame object data
  

  // Display Hand object data
  // var handOutput = document.getElementById("handData");
  // var handString = "";
  // if (frame.hands.length > 0) {
  //   for (var i = 0; i < frame.hands.length; i++) {
  //     var hand = frame.hands[i];

  //     handString += "<div style='width:300px; float:left; padding:5px'>";
  //     handString += "Hand ID: " + hand.id + "<br />";
  //     handString += "Type: " + hand.type + " hand" + "<br />";
  //     handString += "Direction: " + vectorToString(hand.direction, 2) + "<br />";
  //     handString += "Palm position: " + vectorToString(hand.palmPosition) + " mm<br />";
  //     handString += "Grab strength: " + hand.grabStrength + "<br />";
  //     handString += "Pinch strength: " + hand.pinchStrength + "<br />";
  //     handString += "Confidence: " + hand.confidence + "<br />";
  //     handString += "Arm direction: " + vectorToString(hand.arm.direction()) + "<br />";
  //     handString += "Arm center: " + vectorToString(hand.arm.center()) + "<br />";
  //     handString += "Arm up vector: " + vectorToString(hand.arm.basis[1]) + "<br />";

  //     // Hand motion factors
  //     if (previousFrame && previousFrame.valid) {
  //       var translation = hand.translation(previousFrame);
  //       handString += "Translation: " + vectorToString(translation) + " mm<br />";

  //       var rotationAxis = hand.rotationAxis(previousFrame, 2);
  //       var rotationAngle = hand.rotationAngle(previousFrame);
  //       handString += "Rotation axis: " + vectorToString(rotationAxis) + "<br />";
  //       handString += "Rotation angle: " + rotationAngle.toFixed(2) + " radians<br />";

  //       var scaleFactor = hand.scaleFactor(previousFrame);
  //       handString += "Scale factor: " + scaleFactor.toFixed(2) + "<br />";
  //     }

  //     // IDs of pointables associated with this hand
  //     if (hand.pointables.length > 0) {
  //       var fingerIds = [];
  //       for (var j = 0; j < hand.pointables.length; j++) {
  //         var pointable = hand.pointables[j];
  //           fingerIds.push(pointable.id);
  //       }
  //       if (fingerIds.length > 0) {
  //         handString += "Fingers IDs: " + fingerIds.join(", ") + "<br />";
  //       }
  //     }

  //     handString += "</div>";
  //   }
  // }
  // else {
  //   handString += "No hands";
  // }
  // handOutput.innerHTML = handString;

  // Display Pointable (finger and tool) object data
  var pointableOutput = document.getElementById("about");
  var pointableString = "";
  if (frame.pointables.length > 0) {
    var fingerTypeMap = ["Thumb", "Index finger", "Middle finger", "Ring finger", "Pinky finger"];
    var boneTypeMap = ["Metacarpal", "Proximal phalanx", "Intermediate phalanx", "Distal phalanx"];
    document.body.style.backgroundColor = "gray";


    
  }
  else {
    
    document.body.style.backgroundColor = "#eee";
  }
  pointableOutput.innerHTML = pointableString;

  // Display Gesture object data
  // var gestureOutput = document.getElementById("gestureData");
  // var gestureString = "";
  // if (frame.gestures.length > 0) {
  //   if (pauseOnGesture) {
  //     togglePause();
  //   }
  //   for (var i = 0; i < frame.gestures.length; i++) {
  //     var gesture = frame.gestures[i];
  //     gestureString += "Gesture ID: " + gesture.id + ", "
  //                   + "type: " + gesture.type + ", "
  //                   + "state: " + gesture.state + ", "
  //                   + "hand IDs: " + gesture.handIds.join(", ") + ", "
  //                   + "pointable IDs: " + gesture.pointableIds.join(", ") + ", "
  //                   + "duration: " + gesture.duration + " &micro;s, ";

  //     switch (gesture.type) {
  //       case "circle":
  //         document.getElementById("gestureData").style.color = "magenta";
  //         break;
  //       case "swipe":
  //         //document.body.innerHTML = "Some new HTML content";
  //         break;
  //       case "screenTap":
  //       case "keyTap":
  //         gestureString += "position: " + vectorToString(gesture.position) + " mm";
  //         break;
  //       default:
  //         gestureString += "unkown gesture type";
  //     }
  //     gestureString += "<br />";
  //   }
  // }
  // else {
  //   gestureString += "No gestures";
  // }
  // gestureOutput.innerHTML = gestureString;

  // Store frame for motion functions
  previousFrame = frame;
})

function vectorToString(vector, digits) {
  if (typeof digits === "undefined") {
    digits = 1;
  }
  return "(" + vector[0].toFixed(digits) + ", "
             + vector[1].toFixed(digits) + ", "
             + vector[2].toFixed(digits) + ")";
}

function togglePause() {
  paused = !paused;

  if (paused) {
    document.getElementById("pause").innerText = "Resume";
  } else {
    document.getElementById("pause").innerText = "Pause";
  }
}

function pauseForGestures() {
  if (document.getElementById("pauseOnGesture").checked) {
    pauseOnGesture = true;
  } else {
    pauseOnGesture = false;
  }
}
