let config = {
    type: Phaser.CANVAS,
    width: 360,
    height: 640,
    physics: {
        default: 'arcade'
    },
    scene: {
        init: init,
        preload: preload,
        create: create,
        update: update
    },
    backgroundColor: '#ADD8E6',
    audio: {
        disableWebAudio: true
    },
    autoCenter: true
};

//------------global vars-----------
let game = new Phaser.Game(config);

//variable de fin de puzzle
let successfulDropoff;

//var de la flèche
var nextArrow;

//vars de son
var holdSound;
var wrongSound;
var correctSound;
var finishSound;

//var du background
var gameBg;

//var de l'étoile de fin
var star;
var starScale;

//
function init() {
}

function preload() {
    //---personnage en transparence---
    this.load.image('background', './assets/Gepeto.png');
    
    //----membres----
    this.load.image('head', './assets/gHead-01.png');
    this.load.image('body', './assets/gBody-01.png');
    this.load.image('handL', './assets/gHandL-01.png');
    this.load.image('hips', './assets/gHips-01.png');
    this.load.image('legL', './assets/gLegL-01.png');
    this.load.image('legR', './assets/gLegR-01.png');
    
     //---arrow next---
    this.load.image('nextArrow', './assets/blue-arrow.png');
    
    //---audio files---
    this.load.audio('hold', './assets/hold.wav');
    this.load.audio('wrong', './assets/wrong.wav');
    this.load.audio('correct', './assets/correct.wav');
    this.load.audio('finish', './assets/finish.wav');
    
    //---star at the end---
    this.load.image('star', './assets/blue-star.png');
    
    //---background pattern---
    this.load.image('gameBg', './assets/feuilledroite-01-01.png');

}

function create() {
    gameBg = this.add.image(180, 320, 'gameBg');
    gameBg.setVisible(false);
    
    var image = this.add.image(200, 250, 'background');
    image.alpha = 0.3;
    image.setScale(0.45);
    
    //---star---
    starScale = 0.1;
    star = this.add.image(90,530, 'star');
    star.setScale(starScale);
    star.setVisible(false);
    star.setDepth(0);
    
    //---audio---
    holdSound = this.sound.add('hold');
    wrongSound = this.sound.add('wrong');
    correctSound = this.sound.add('correct');
    finishSound = this.sound.add('finish');
    
    //drop off counter
    successfulDropoff = 0;
    
    //---next arrow----
    nextArrow = this.add.image(300, 550, 'nextArrow');
    nextArrow.setScale(0.7);
    nextArrow.setVisible(false);
    
    //----les membres-----
    var head = this.add.image(260, 528, 'head', Phaser.Math.RND.pick(frames)).setInteractive();
    this.input.setDraggable(head);
//    head.setScale(2);
    head.setName('head');
    head.setScale(0.45);
    
    var body = this.add.image(70, 550, 'body', Phaser.Math.RND.pick(frames)).setInteractive();
    this.input.setDraggable(body);
    body.setName('body');
    body.setScale(0.45);
    
    var handL = this.add.image(80, 315, 'handL', Phaser.Math.RND.pick(frames)).setInteractive();
    this.input.setDraggable(handL);
    handL.setName('handL');
    handL.setScale(0.45);
    
    var hips = this.add.image(70, 412, 'hips', Phaser.Math.RND.pick(frames)).setInteractive();
    this.input.setDraggable(hips);
    hips.setName('hips');
    hips.setScale(0.45);
    
    var legL = this.add.image(50, 212, 'legL', Phaser.Math.RND.pick(frames)).setInteractive();
    this.input.setDraggable(legL);
    legL.setName('legL');
    legL.setScale(0.45);
    
    var legR = this.add.image(50, 80, 'legR', Phaser.Math.RND.pick(frames)).setInteractive();
    this.input.setDraggable(legR);
    legR.setName('legR');
    legR.setScale(0.45);
    
    //-----les drop zones----
    //  A drop zone
    var zone = this.add.zone(220, 102, 100, 140).setRectangleDropZone(100, 140);
    zone.setName('head');
    
    //  A drop zone
    var zone2 = this.add.zone(238, 218, 90, 90).setRectangleDropZone(90, 90);
    zone2.setName('body');
    
    //  A drop zone
    var zone3 = this.add.zone(147, 220, 90, 97).setRectangleDropZone(90, 97);
    zone3.setName('handL');
    
    
    //  A drop zone
    var zone4 = this.add.zone(252, 405, 40, 110).setRectangleDropZone(40, 110);
    zone4.setName('legR');
    
    //  A drop zone
    var zone5 = this.add.zone(194, 400, 40, 108).setRectangleDropZone(40, 108);
    zone5.setName('legL');
    
     //  A drop zone
    var zone6 = this.add.zone(234, 306, 90, 80).setRectangleDropZone(90, 80);
    zone6.setName('hips');
    
 
    //---drag and drop mechanics---
    this.input.on('dragstart', function (pointer, gameObject) {

        this.children.bringToTop(gameObject);
        holdSound.play();

    }, this);

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

        gameObject.x = dragX;
        gameObject.y = dragY;

    });

    this.input.on('dragenter', function (pointer, gameObject, dropZone) {


    });

    this.input.on('dragleave', function (pointer, gameObject, dropZone) {

    });

    this.input.on('drop', function (pointer, gameObject, dropZone) {
        if(gameObject.name == dropZone.name){
            gameObject.x = dropZone.x;
            gameObject.y = dropZone.y;

            gameObject.input.enabled = false;
            console.log(dropZone.name == gameObject.name);
            console.log('successful dropoff of ' + gameObject.name + ' in ' + dropZone.name);
            
            successfulDropoff++;
            console.log(successfulDropoff);
            correctSound.play();
        }
else{
            gameObject.x = gameObject.input.dragStartX;
            gameObject.y = gameObject.input.dragStartY;
            console.log('failed dropoff of ' + gameObject.name + ' in ' + dropZone.name);
    
            wrongSound.play();
        }
        

    });

    this.input.on('dragend', function (pointer, gameObject, dropped) {

        if (!dropped)
        {
            gameObject.x = gameObject.input.dragStartX;
            gameObject.y = gameObject.input.dragStartY;
            
        }
        
        if(successfulDropoff === 6){
            console.log("well done!!!!");
            nextArrow.setVisible(true);
            nextArrow.setInteractive();
            finishSound.play();
            star.setVisible(true);
            gameBg.setVisible(true);
    }
        
        nextArrow.on('pointerdown', onClick);

    });
    

}


function update() {
    if(successfulDropoff === 6){
         starScale += 0.001;
        star.setScale(starScale);
        if (starScale > 0.2){
            starScale = 0.2;
        } }

}

function onClick(){
//    window.open("https://www.google.com", "_blank");
    window.location.replace("http://www.w3schools.com");

}
