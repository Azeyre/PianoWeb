//Debut Variables Globales

//Mode de débug
var debug = false;

//Audio
var audio = [];
var rep = "Sound/";

//Octave
var numClavier = 0;
var boutonUn = document.getElementById("un");
var boutonDeux = document.getElementById("deux");

//Touche du clavier utilise pour jouer
var chNote = ['A','Z','E','R','T','Y','U','I','O','Q','S','D','F','G','H','J','K','L','&','É','\"','\'','(','-','È','_','Ç','À',')','='];
var chNote2 = ['1','2','3','4','5','6','7','8','9','0','Û','»'];

//Metronome
var tempoOn;
var chrono;
var timeChrono = 0;
var chronoOn = false;
var bpm = 1;
var bpmInput;

//Autoplay
var noteJoue = [];
var placeNote = 0;
var tempsJoue = [];
var placeTemps = 0;
var autoPlay;
var timer = 0;
var delay;

//Fin Variables Globales

//Fonction d'initialisation
function setup (){
initAudio();
//Canvas
var pianoCanvas = document.getElementById("pianoCanvas");
pianoCanvas.height = window.innerHeight;
pianoCanvas.width = window.innerWidth;

roundRect(5, 5, (pianoCanvas.width) - 10, (pianoCanvas.height) - 10, 50);
tempoRect((pianoCanvas.width / 20) * 17.8, (pianoCanvas.height / 20) * 1.5, 120, 80, 10);
fondTouche();
toucheClavier();
toucheBLanche();
toucheNoir();
changeInstru(1);
buttonOctave(1);
drawTempo(888,1);
}

//Liste des évenements
window.addEventListener("load",setup);
//Rafraichissement du canvas lors d'un redimension de la page
window.onresize = function(event){
  setup();
}

//Octave
function buttonOctave(octave){
  switch(octave){
    case 1:
    numClavier = 0;
    boutonUn.style.background = "#008000";
    boutonDeux.style.background = "#007cff";
    break;

    case 2:
    numClavier = 1;
    boutonUn.style.background = "#007cff";
    boutonDeux.style.background = "#008000";
    break;
  }
}

//Bouton pour changer l'instrument
function changeInstru(mode){
var instruPiano = document.getElementById("iconePiano");
var instruGuitare = document.getElementById("iconeGuitare");
var instruBatterie = document.getElementById("iconeBatterie");
 switch(mode){
   case 1:
   instruPiano.style.background = "#008000";
   instruGuitare.style.background = "#808080";
   instruBatterie.style.background = "#808080";
   break;

   case 2:
   instruPiano.style.background = "#B22222";
   instruBatterie.style.background = "#008000";
   instruGuitare.style.background = "#B22222";
   break;

   case 3:
   instruPiano.style.background = "#B22222";
   instruBatterie.style.background = "#B22222";
   instruGuitare.style.background = "#008000";
   break;

   default: alert("La variable n'est pas valide.");
 }
}


// Debut Metronome
document.body.onclick = function(e){
  if(e.layerX >= (pianoCanvas.width / 20) * 17.8 * 0.8 && e.layerX <= (pianoCanvas.width / 20) * 17.8 * 0.8 + 100){
   if(e.layerY >= (pianoCanvas.height / 20) * 1.5 * 0.6 && e.layerY <= (pianoCanvas.height / 20) * 1.5 * 0.6 + 55){
      bpmInput = document.createElement("input");
      bpmInput.setAttribute("type", "value");
      bpmInput.setAttribute("id", "BPM");
      bpmInput.setAttribute("min", "1");
      bpmInput.setAttribute("max", "999");
      document.body.appendChild(bpmInput);
   }
  }
 }
 
 document.onkeydown = function(event) {
     event = event || window.event;
     if(event.keyCode === 13){
       if(!(document.getElementById("BPM") === null)){
         if(document.getElementById("BPM").value <= 999 && document.getElementById("BPM").value >= 1){
           bpm = document.getElementById("BPM").value;
         document.body.removeChild(bpmInput);
         drawTempo(bpm, 0);
         } else{
           alert("Veuillez choisir une valeur entre 1 et 999");
         }
       }
     }
 };

//Activation ou desactivation du metronome
function buttonTempo(){
  var x = document.getElementById("check").checked;
  var tempoMilli = 60000 / bpm;
  if(debug === true){
    console.log("Bouton tempo : " + x);
  }
  if(x === false){
    stopTempo();
  }
  if(x === true){
    tempoOn = setInterval(function(){ tempo() }, tempoMilli);
  }
  console.log(tempoMilli);
}

//Lecture du son du metronome
function tempo(){
  playSound(69);
}

//Arret de la lecture du son
function stopTempo(){
  clearInterval(tempoOn);
}

//Rectangle noir ou s'affiche le BPM
function tempoRect(x, y, w, h, radius)
{
  var pianoCanvas = document.getElementById("pianoCanvas");
  var context = pianoCanvas.getContext("2d");

  var r = x + w;
  var b = y + h;
  context.beginPath();
  context.strokeStyle='rgb(0,0,0)';
  context.lineWidth="1";
  context.moveTo(x+radius, y);
  context.lineTo(r-radius, y);
  context.quadraticCurveTo(r, y, r, y+radius);
  context.lineTo(r, y+h-radius);
  context.quadraticCurveTo(r, b, r-radius, b);
  context.lineTo(x+radius, b);
  context.quadraticCurveTo(x, b, x, b-radius);
  context.lineTo(x, y+radius);
  context.quadraticCurveTo(x, y, x+radius, y);
  context.stroke();
  context.fillStyle = "black";
  context.opacity = 1.0;
  context.fill();

}
//Affichage du BPM dans le rectangle noir
function drawTempo(number, x){
  var pianoCanvas = document.getElementById("pianoCanvas");
  var context = pianoCanvas.getContext("2d");
  if(x === 0){
    tempoRect((pianoCanvas.width / 20) * 17.8, (pianoCanvas.height / 20) * 1.5, 120, 80, 10);
    context.font = "60px Arial";
    context.fillStyle = "red";
    context.fillText(number,(pianoCanvas.width / 20) * 17.9, (pianoCanvas.height / 20) * 2.8);
  } else if(x === 1){
    tempoRect((pianoCanvas.width / 20) * 17.8, (pianoCanvas.height / 20) * 1.5, 120, 80, 10);
    context.font = "60px Arial";
    context.fillStyle = "grey";
    context.fillText(number,(pianoCanvas.width / 20) * 17.9, (pianoCanvas.height / 20) * 2.8); 
  }
}
// Debut Metronome



// Debut Design Piano
//Création du rectangle avec bord arrondi pour le piano
function roundRect(x, y, w, h, radius)
{
  var pianoCanvas = document.getElementById("pianoCanvas");
  var context = pianoCanvas.getContext("2d");

  var r = x + w;
  var b = y + h;
  context.beginPath();
  context.strokeStyle='rgb(255,0,170)';
  context.lineWidth="6";
  context.moveTo(x+radius, y);
  context.lineTo(r-radius, y);
  context.quadraticCurveTo(r, y, r, y+radius);
  context.lineTo(r, y+h-radius);
  context.quadraticCurveTo(r, b, r-radius, b);
  context.lineTo(x+radius, b);
  context.quadraticCurveTo(x, b, x, b-radius);
  context.lineTo(x, y+radius);
  context.quadraticCurveTo(x, y, x+radius, y);
  context.stroke();
  context.fillStyle = "#660033"
  context.opacity = 0.5;
  context.fill();

  context.beginPath();
  context.strokeStyle="black"
  context.lineWidth="10";
  context.moveTo(x+radius, y);
  context.lineTo(r-radius, y);
  context.quadraticCurveTo(r, y, r, y+radius);
  context.lineTo(r, y+h-radius);
  context.quadraticCurveTo(r, b, r-radius, b);
  context.lineTo(x+radius, b);
  context.quadraticCurveTo(x, b, x, b-radius);
  context.lineTo(x, y+radius);
  context.quadraticCurveTo(x, y, x+radius, y);
  context.stroke();
  context.fillStyle = "#ff0066";
  context.opacity = 0.5;
  context.fill();
}

//Initialisation du fond blanc du piano
function fondTouche(){
  var pianoCanvas = document.getElementById("pianoCanvas");
  var context = pianoCanvas.getContext("2d");
  context.fillStyle = "black";
  context.fillRect((pianoCanvas.width / 20) - 3,((pianoCanvas.height) / 3) - 3,(pianoCanvas.width / 20) * 18 + 6, (((pianoCanvas.height) / 5) * 3) + 6);
  context.fillStyle = "white";
  context.fillRect((pianoCanvas.width / 20),(pianoCanvas.height) / 3,(pianoCanvas.width / 20) * 18, ((pianoCanvas.height) / 5) * 3);
}

//Affichage des touches blanches du piano
function toucheBLanche(){
  var pianoCanvas = document.getElementById("pianoCanvas");
  var context = pianoCanvas.getContext("2d");
  for(var i = 2 ; i < 19 ; i++){
    if(!(i === 4   || i === 8 || i === 11 || i === 15 || i === 18)){
      context.beginPath();
      context.strokeStyle = "black";
      context.lineWidth = "5";
      context.moveTo((pianoCanvas.width / 20) * i, ((pianoCanvas.height) / 3) * 2);
      context.lineTo((pianoCanvas.width / 20) * i, pianoCanvas.height - 60);
      context.stroke();
    } else {
      context.beginPath();
      context.strokeStyle = "black";
      context.lineWidth = "5";
      context.moveTo((pianoCanvas.width / 20) * i, ((pianoCanvas.height) / 3));
      context.lineTo((pianoCanvas.width / 20) * i, pianoCanvas.height - 60);
      context.stroke();
    }
  } 
}

//Affichage des touches noires du piano
function toucheNoir(){
  var pianoCanvas = document.getElementById("pianoCanvas");
  var context = pianoCanvas.getContext("2d");

  for(var i = 0 ; i < 17 ; i++){
    if(!(i === 0 || i === 3 || i === 7 || i === 10 || i === 14)){
      context.fillStyle = "black";
      context.fillRect((pianoCanvas.width / 20) * (i + 0.75) , (pianoCanvas.height) / 3, (pianoCanvas.width / 20) * 0.5, (pianoCanvas.height) / 3);
    }
  }
}

//Remise d'une touche appuyée par défaut en blanc
function toucheDefault(x){
  var placeTouche = chNote.indexOf(x);
  var pianoCanvas = document.getElementById("pianoCanvas");
  var context = pianoCanvas.getContext("2d");
  if(placeTouche <= 17){
    context.fillStyle = "white";
    context.fillRect((pianoCanvas.width / 20) * (placeTouche + 1), (pianoCanvas.height) / 3, (pianoCanvas.width / 20), ((pianoCanvas.height) / 3) * 2 - 65);
  }
  else{
    context.fillStyle = "black";
    context.fillRect((pianoCanvas.width / 20) * (placeTouche + 0.75) , (pianoCanvas.height) / 3, (pianoCanvas.width / 20) * 0.5, (pianoCanvas.height) / 3);
  }
  toucheClavier();
}

//Affichage des touches du clavier correspond au touche du piano
function toucheClavier(){
  var pianoCanvas = document.getElementById("pianoCanvas");
  var context = pianoCanvas.getContext("2d");
  context.fillStyle = "black";

  var fontSize = 135 * (window.innerHeight / 2160);
  //Affiche les touches du clavier sur le piano
  context.font = fontSize.toString() + "px Arial Bold";

  for(var i = 0 ; i < 18 ; i++){
    if(i === 7 || i === 15){
      context.fillText(chNote[i],(pianoCanvas.width / 20) * (i + 1 + 0.4), (pianoCanvas.height / 10) * 9);
    }else{
      context.fillText(chNote[i],(pianoCanvas.width / 20) * (i + 1 + 0.3), (pianoCanvas.height / 10) * 9);
    }
  }
}

//Animation d'une touche jouée en grise
function animTouche(x){
  if(debug === true){
    console.log("Touche appuyée : " + chNote.indexOf(x));
  }
  var placeTouche = chNote.indexOf(x);

  var pianoCanvas = document.getElementById("pianoCanvas");
  var context = pianoCanvas.getContext("2d");

  //Inferieur ou egal a 17 pour les touches de A O puis de Q a L donc pour les touches blanches
  if(placeTouche <= 17){
    context.fillStyle = "grey";
    context.fillRect((pianoCanvas.width / 20) * (placeTouche + 1), (pianoCanvas.height) / 3, (pianoCanvas.width / 20), ((pianoCanvas.height) / 3) * 2 - 65);
    toucheNoir();
  }

  //Encadrement des valeurs pour les touches noires qui sont disposees de facon discontinues
  if(placeTouche >= 18 && placeTouche <= 19){
    context.fillStyle = "grey";
    context.fillRect((pianoCanvas.width / 20) * (placeTouche - 17 + 0.75) , (pianoCanvas.height) / 3, (pianoCanvas.width / 20) * 0.5, (pianoCanvas.height) / 3);
  }
  if(placeTouche >= 20 && placeTouche <= 22){
    context.fillStyle = "grey";
    context.fillRect((pianoCanvas.width / 20) * (placeTouche - 16 + 0.75) , (pianoCanvas.height) / 3, (pianoCanvas.width / 20) * 0.5, (pianoCanvas.height) / 3);
  }
  if(placeTouche >= 23 && placeTouche <= 24){
    context.fillStyle = "grey";
    context.fillRect((pianoCanvas.width / 20) * (placeTouche - 15 + 0.75) , (pianoCanvas.height) / 3, (pianoCanvas.width / 20) * 0.5, (pianoCanvas.height) / 3);
  }
  if(placeTouche >= 25 && placeTouche <= 27){
    context.fillStyle = "grey";
    context.fillRect((pianoCanvas.width / 20) * (placeTouche - 14 + 0.75) , (pianoCanvas.height) / 3, (pianoCanvas.width / 20) * 0.5, (pianoCanvas.height) / 3);
  }
  if(placeTouche >= 28 && placeTouche <= 29){
    context.fillStyle = "grey";
    context.fillRect((pianoCanvas.width / 20) * (placeTouche - 13 + 0.75) , (pianoCanvas.height) / 3, (pianoCanvas.width / 20) * 0.5, (pianoCanvas.height) / 3);
  }
  toucheClavier();
}
// Fin Design Piano



// Debut Audio + Event

//Initialisation des fichiers audio
function initAudio(){
  for(var i = 1 ; i < 68 ; i++){
  audio[i] = rep + "Note" + i + ".wav";
  if(debug === true){
    console.log(rep + "Note" + i + ".wav");
  }
}
audio[69] = rep + "Tempo.wav";
}

//Event Touche appuyée
//Detection de la touche appuyee pour jouer le son de la note correspondante et faire l'animation de la touche
document.onkeypress = function(event) {
    event = event || window.event;
    var charCode = event.keyCode || event.which;
    var charStr = String.fromCharCode(charCode).toUpperCase();
    if(chronoOn === true){
      addChrono();
      noteJoue[placeNote] = charStr;
      placeNote = placeNote + 1;
    }
    if(charStr === chNote[0]){
      playSound(1 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === chNote[1]){
      playSound(3 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === chNote[2]){
      playSound(5 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === chNote[3]){
      playSound(6 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === chNote[4]){
      playSound(8 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === chNote[5]){
      playSound(10 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === chNote[6]){
      playSound(12 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === chNote[7]){
      playSound(13 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === chNote[8]){
      playSound(15 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === chNote[9]){
      playSound(17 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === chNote[10]){
      playSound(18 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === chNote[11]){
      playSound(20 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === chNote[12]){
      playSound(22 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === chNote[13]){
      playSound(24 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === chNote[14]){
      playSound(25 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === chNote[15]){
      playSound(27 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === chNote[16]){
      playSound(29 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === chNote[17]){
      playSound(30 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === chNote[18]){
      playSound(2 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === chNote[19]){
      playSound(4 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === chNote[20]){
      playSound(7 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === chNote[21]){
      playSound(9 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === chNote[22]){
      playSound(11 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === chNote[23]){
      playSound(14 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === chNote[24]){
      playSound(16 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === chNote[25]){
      playSound(19 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === chNote[26]){
      playSound(21 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === chNote[27]){
      playSound(23 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === chNote[28]){
      playSound(26 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === chNote[29]){
      playSound(28 + (30 * numClavier));
      animTouche(charStr);
    }
};

//Lecture d'un son en fonction de la touche appuyee, exprimee ici sous la variable x
function playSound(x){
var sound = new Audio(audio[x]);
sound.volume = document.getElementById("volumeRange").value / 100;
sound.play();
  if(debug === true){
    console.log("Son : " + audio[x] + ", Touche : " + x);
    console.log("Volume : " + sound.volume * 100);
  }
}

//Event touche relachée
//Detection de la touche relachee pour re-afficher les touches blanches/noires apres leurs animations
document.onkeyup = function(event) {
  event = event || window.event;
  var charCode = event.keyCode || event.which;
  var charStr = String.fromCharCode(charCode).toUpperCase();
  console.log(charStr);
  if(chNote.indexOf(charStr) >= 0){
     toucheDefault(charStr);
     toucheBLanche();
     toucheNoir();
    }
  if(chNote2.indexOf(charStr) >= 0){
    toucheBLanche();
    toucheNoir();
  }
};
// Fin Audio + Event

// Debut AutoPlay
function startChrono(){
  tempsJoue = [];
  noteJoue = [];
  chronoOn = true;
  delay = Date.now();
  
  if(debug === true){
    console.log("Start Chrono");
  }
}

function addChrono(){
  tempsJoue[placeTemps] = Date.now() - delay;
  placeTemps = placeTemps + 1;
  delay = Date.now();
}

function stopChrono(){
  if(debug === true){
    for(var nbr = 0 ; nbr < tempsJoue.length ; nbr++){
      console.log("Note : " + noteJoue[nbr] + " jouée à " + tempsJoue[nbr] + " millisecondes.");
    }
  }
  if(chronoOn === false){
    alert("Erreur : Vous n'avez rien enregisté !")
  }
  else {
    chronoOn = false;
  }
}

function play(){
    autoPlay = setTimeout(autoPlayer, tempsJoue[timer]);
}

function autoPlayer(){
  var charStr = noteJoue[timer];
  toucheBLanche();
  if(charStr === "A"){
      playSound(1 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === "Z"){
      playSound(3 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === "E"){
      playSound(5 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === "R"){
      playSound(6 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === "T"){
      playSound(8 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === "Y"){
      playSound(10 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === "U"){
      playSound(12 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === "I"){
      playSound(13 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === "O"){
      playSound(15 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === "Q"){
      playSound(17 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === "S"){
      playSound(18 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === "D"){
      playSound(20 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === "F"){
      playSound(22 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === "G"){
      playSound(24 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === "H"){
      playSound(25 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === "J"){
      playSound(27 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === "K"){
      playSound(29 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === "L"){
      playSound(30 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === "&"){
      playSound(2 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === "É"){
      playSound(4 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === "\""){
      playSound(7 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === "\'"){
      playSound(9 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === "("){
      playSound(11 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === "-"){
      playSound(14 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === "È"){
      playSound(16 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === "_"){
      playSound(19 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === "Ç"){
      playSound(21 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === "À"){
      playSound(23 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === ")"){
      playSound(26 + (30 * numClavier));
      animTouche(charStr);
    }
    if(charStr === "="){
      playSound(28 + (30 * numClavier));
      animTouche(charStr);
    }
    timer = timer + 1;
    play();
    toucheNoir();
    toucheBLanche();
    toucheClavier(); 
    if(timer >= tempsJoue.length){
      stopPlayer();
      console.log("Stop");
      timer = 0;
    }
}

function stopPlayer(){
  fondTouche();
  toucheClavier();
  toucheBLanche();
  toucheNoir();
  clearTimeout(autoPlay);
}
// Fin AutoPlay

//Debut Aide
function aide(){
  var popupOctave = document.getElementById("popupOctave");
  popupOctave.style.visibility = "visible";

  var popupInstrument = document.getElementById("popupInstrument");
  popupInstrument.style.visibility = "visible";

  var popupVolume = document.getElementById("popupVolume");
  popupVolume.style.visibility = "visible";

  var popupAutoplay = document.getElementById("popupAutoplay");
  popupAutoplay.style.visibility = "visible";

  var popupBpm = document.getElementById("popupBpm");
  popupBpm.style.visibility = "visible";
}
function fermeAide(){
  var popupOctave = document.getElementById("popupOctave");
  popupOctave.style.visibility = "hidden";

  var popupInstrument = document.getElementById("popupInstrument");
  popupInstrument.style.visibility = "hidden";

  var popupVolume = document.getElementById("popupVolume");
  popupVolume.style.visibility = "hidden";

  var popupAutoplay = document.getElementById("popupAutoplay");
  popupAutoplay.style.visibility = "hidden";
  
  var popupBpm = document.getElementById("popupBpm");
  popupBpm.style.visibility = "hidden";
}
//Fin Aide