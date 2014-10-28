var Leap = require("leapjs");           // load leapjs
var controller = new Leap.Controller();
var five = require("johnny-five"),      // load johnny-five (arduino)
  board = new five.Board();
var boardok = false;
var led = null;
var servo = null;
var servo2 = null;
var clawmaxangle = 180;

// Starting arduino
board.on("ready", function(){
  led = new five.Led(13);
  servo = new five.Servo({pin: 9, range: [50, clawmaxangle]});
  servo2 = new five.Servo({pin: 10, range: [50, clawmaxangle]});

  boardok = true;
  servo.max();
});

/**
 * Map function (like map on arduino)
 */
function map(x, in_min, in_max, out_min, out_max) {
  return Math.round((x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min);
}

// Leap Config
var controllerOptions = {
  enableGestures: true,
  background : true
};

// Leap controls
Leap.loop(controllerOptions , {
  hand: function (hand) {
    if (boardok) {
      var valor =  (hand.pinchStrength);
      var novo_valor = clawmaxangle * valor;

      novo_valor = Math.round(novo_valor);
      servo.to(novo_valor);

      var base = map(hand.roll().toFixed(2), -2,2,180,0)
      servo2.to(base);
    };
  },
});

// Initializing leapmotion

controller.on('ready', function() {
    console.log("Leap Motion is ready...");
});

controller.on('deviceConnected', function() {
    console.log("Leap Motion is connected...");
});

controller.on('deviceDisconnected', function() {
    console.log("Leap Motion is disconnected...");
});

// Connect to leapmotion
controller.connect();