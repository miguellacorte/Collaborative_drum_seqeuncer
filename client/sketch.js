// import { io } from "socket.io-client";

// const socket = io("http://localhost:3000");

// socket.on("connect", () => {
//   console.log(`you conencted with id: ${socket.id}`);
// });

let defaultVal,
  setRythmicDivKick,
  setRythmicDivSnare,
  setRythmicDivClosedHiHat,
  button,
  muteBtn1,
  muteBtn2,
  muteBtn3;

let setKick, setSnare, setClosedHiHat;
let kick, snare, closedHiHat;

let intervalsArr = [
  "2n",
  "3n",
  "4n",
  "5n",
  "6n",
  "7n",
  "8n",
  "9n",
  "15n",
  "16n",
  "32n",
];

let intervalsArrSnare = [
  "1n",
  "2n",
  "3n",
  "4n",
  "5n",
  "6n",
  "7n",
  "8n",
  "9n",
  "10n",
  "16n",
  "32n",
];

function preload() {
  let baseURL = "assets/";

  const hihat = new Tone.Channel(-0.25, -1).toDestination();
  var pingPong = new Tone.PingPongDelay("4n", 0.2).toDestination();

  hihat.connect(pingPong);

  kick = new Tone.Players({
    kick1: baseURL + "kick1.mp3",
    kick2: baseURL + "kick2.mp3",
    kick3: baseURL + "kick3.mp3",
    kick4: baseURL + "kick4.mp3",
  }).toDestination();

  snare = new Tone.Players({
    snare1: baseURL + "snare1.mp3",
    snare2: baseURL + "snare2.mp3",
    snare3: baseURL + "snare3.mp3",
    snare4: baseURL + "snare4.mp3",
  }).toDestination();

  closedHiHat = new Tone.Players({
    closedHiHat1: baseURL + "hihat1.mp3",
    closedHiHat2: baseURL + "hihat2.mp3",
    closedHiHat3: baseURL + "hihat3.mp3",
  }).connect(hihat);
}

function setup() {
  let cnv = createCanvas(1000, 1000);
  // cnv.mousePressed(canvasPressed);

  //mixer section
  snare.volume.value = -8;
  kick.volume.value = -10;
  closedHiHat.volume.value = -8;

  // effects

  const dist = new Tone.Distortion(0.8).toDestination();

  defaultVal = 5;

  setRythmicDivKick = createSlider(0, 9, defaultVal);
  setRythmicDivKick.position(100, 100);
  setRythmicDivKick.style("width", "80px");

  setRythmicDivSnare = createSlider(0, 9, defaultVal);
  setRythmicDivSnare.position(200, 200);
  setRythmicDivSnare.style("width", "80px");

  setRythmicDivClosedHiHat = createSlider(0, 9, defaultVal);
  setRythmicDivClosedHiHat.position(200, 300);
  setRythmicDivClosedHiHat.style("width", "80px");

  // textSize(16);
  // text('word', 100, 150);

  setKick = createSlider(1, 4, 2);
  setKick.position(200, 100);
  setKick.style("width", "80px");

  setSnare = createSlider(1, 4, 2);
  setSnare.position(100, 200);
  setSnare.style("width", "80px");

  setClosedHiHat = createSlider(1, 3, 2);
  setClosedHiHat.position(100, 300);
  setClosedHiHat.style("width", "80px");

  button = createButton("on/off");
  button.position(10, 10);
  button.mousePressed(playSound);

  muteBtn1 = createButton("mute kick");
  muteBtn1.position(350, 100);
  muteBtn1.mousePressed(drumLoopAStop);

  muteBtn2 = createButton("mute snare");
  muteBtn2.position(350, 200);
  muteBtn2.mousePressed(drumLoopBStop);

  muteBtn3 = createButton("mute hihat");
  muteBtn3.position(350, 300);
  muteBtn3.mousePressed(drumLoopCStop);

  const now = Tone.now();

  let bpm = (Tone.Transport.bpm.value = 120);

  drumLoopA = new Tone.Loop((time) => {
    Tone.loaded().then(() => {
      kick.player("kick1").start(time);
    });
  }, intervalsArr[setRythmicDivKick.value()]);

  drumLoopB = new Tone.Loop((time) => {
    Tone.loaded().then(() => {
      snare.player("snare1").start(time);
    });
  }, intervalsArrSnare[setRythmicDivSnare.value()]);

  drumLoopC = new Tone.Loop((time) => {
    Tone.loaded().then(() => {
      closedHiHat.player("closedHiHat1").start(time);
    });
  }, intervalsArr[setRythmicDivClosedHiHat.value()]);

  setRythmicDivKick.changed(() => {
    drumLoopA.interval = intervalsArr[setRythmicDivKick.value()];
  });

  setRythmicDivSnare.changed(() => {
    drumLoopB.interval = intervalsArrSnare[setRythmicDivSnare.value()];
  });

  setRythmicDivClosedHiHat.changed(() => {
    drumLoopC.interval = intervalsArr[setRythmicDivClosedHiHat.value()];
  });

  setKick.changed(() => {
    drumLoopA.stop();

    drumLoopA = new Tone.Loop((time) => {
      Tone.loaded().then(() => {
        kick.player(`kick${setKick.value()}`).start(time);
      });
    }, intervalsArr[setRythmicDivKick.value()]);

    drumLoopA.start();
  });

  setSnare.changed(() => {
    drumLoopB.stop();

    drumLoopB = new Tone.Loop((time) => {
      Tone.loaded().then(() => {
        snare.player(`snare${setSnare.value()}`).start(time);
      });
    }, intervalsArrSnare[setRythmicDivSnare.value()]);

    drumLoopB.start();
  });

  setClosedHiHat.changed(() => {
    drumLoopC.stop();

    drumLoopC = new Tone.Loop((time) => {
      Tone.loaded().then(() => {
        closedHiHat.player(`closedHiHat${setClosedHiHat.value()}`).start(time);
      });
    }, intervalsArr[setRythmicDivClosedHiHat.value()]);

    drumLoopC.start();
  });
}

function drumLoopAStop() {
  if (drumLoopA.state == "started") {
    drumLoopA.stop();
  } else {
    drumLoopA.start();
  }
}

function drumLoopBStop() {
  if (drumLoopB.state == "started") {
    drumLoopB.stop();
  } else {
    drumLoopB.start();
  }
}

function drumLoopCStop() {
  if (drumLoopC.state == "started") {
    drumLoopC.stop();
  } else {
    drumLoopC.start();
  }
}
function playSound() {
  console.log("play");
  Tone.start();
  Tone.Transport.start();
  drumLoopA.start();
}

function draw() {
  background(220);
}
