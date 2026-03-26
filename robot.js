var robot;
var ostacoli = [];

function startGame() {
    myGameArea.start();
    robot.loadImages();
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = 790;
        this.canvas.height = 370;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20); 
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    drawGameObject: function(gameObject) {
            this.context.drawImage(
                gameObject.image,
                gameObject.x,
                gameObject.y,
                gameObject.width,
                gameObject.height
            );
        
    },
    stop: function() {
        clearInterval(this.interval);
    }
};

var robot = {
    x: 10,
    y: 120,
    width: 80,
    height: 80,
    speedX: 0,
    speedY: 0,
    imageList: [],
    actualFrame: 0, 
    contaFrame: 0,
    image: null,

    loadImages: function() {
        for (imgPath of running) {
            var img = new Image(this.width, this.height);
            img.src = imgPath;
            this.imageList.push(img);
        }
        this.image = this.imageList[this.actualFrame];
    },

    newPos: function() {
        this.x = this.x + this.speedX;
        this.y = this.y + this.speedY;

        if (this.x < 0) { 
            this.x = 0; 
        }
        if (this.y < 0) { 
            this.y = 0; 
        }
        if (this.x > myGameArea.canvas.width - this.width) { 
            this.x = myGameArea.canvas.width - this.width; 
        }
        if (this.y > myGameArea.canvas.height - this.height) { 
            this.y = myGameArea.canvas.height - this.height; 
        }
    },

    update: function() {
        if (this.speedX != 0 || this.speedY != 0) {
            this.contaFrame = this.contaFrame + 1;
            if (this.contaFrame >= 6) {
                this.contaFrame = 0;
                this.actualFrame = (this.actualFrame + 1) % this.imageList.length;
                this.image = this.imageList[this.actualFrame];
            }
        }
    },

    crashWith: function(otherobj) {
        let myleft = this.x;
        let myright = this.x + (this.width);
        let mytop = this.y;
        let mybottom = this.y + (this.height);
        let otherleft = otherobj.x;
        let otherright = otherobj.x + (otherobj.width);
        let othertop = otherobj.y;
        let otherbottom = otherobj.y + (otherobj.height);
        
        let crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
};

function obstacleComponent(width, height, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
   
}
function disegnaOstacolo(tubo) {
    let ctx = myGameArea.context;
    ctx.fillStyle = "green";
    ctx.fillRect(tubo.x, tubo.y, tubo.width, tubo.height);
}

function updateGameArea() {
    for (let i = 0; i < ostacoli.length; i++) {
        if (robot.crashWith(ostacoli[i])) {
            myGameArea.stop();
            return;
        }
    }

    myGameArea.clear();
    myGameArea.frameNo = (myGameArea.frameNo || 0) + 1;

    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        let x = myGameArea.canvas.width;
        let altezzaMin = 20;
        let altezzaMax = 200;
        let h = Math.floor(Math.random() * (altezzaMax - altezzaMin + 1) + altezzaMin);
        let gapMin = 150;
        let gapMax = 200;
        let g = Math.floor(Math.random() * (gapMax - gapMin + 1) + gapMin);
        
        ostacoli.push(new obstacleComponent(20, h, x, 0));
        ostacoli.push(new obstacleComponent(20, myGameArea.canvas.height - h - g, x, h + g));
    }

    for (let i = 0; i < ostacoli.length; i++) {
        ostacoli[i].x = ostacoli[i].x - 2;
        disegnaOstacolo(ostacoli[i]);
    }

    let ctx = myGameArea.context;
    ctx.font = "30px Consolas";
    ctx.fillStyle = "black";
    ctx.fillText("SCORE: " + myGameArea.frameNo, 280, 40);

    robot.newPos();
    robot.update();
    myGameArea.drawGameObject(robot);
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) { 
        return true; 
    }
    return false;
}

function moveup() { 
    robot.speedY = -3;
 }
function movedown() { 
    robot.speedY = 3; 

}
function moveleft() { 
    robot.speedX = -3; 
}

    function moveright() { 
    robot.speedX = 3; 
}

function clearmove() { 
    robot.speedX = 0; robot.speedY = 0; 
}