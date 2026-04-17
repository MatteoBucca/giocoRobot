var robot;
var punteggio = 0;
var mondo = 1;
var gravita = 0.8;
var attrito = 0.9;

function startGame() {
    myGameArea.start();
    robot.loadImages();
}

var robot = {
    x: 100,
    y: 120,
    width: 60,
    height: 60,
    speedX: 0,
    speedY: 0,
    imageList: [],
    actualFrame: 0, 
    contaFrame: 0,
    image: null,
    onGround: false,
    saltoForza: -15,

    loadImages: function() {
        for (imgPath of running) {
            var img = new Image(this.width, this.height);
            img.src = imgPath;
            this.imageList.push(img);
        }
        this.image = this.imageList[this.actualFrame];
    },

    newPos: function() {
        this.speedY += gravita;
        this.speedX *= attrito;
        this.x += this.speedX;
        this.y += this.speedY;

        let aTerra = false;
        let pavimentoY = myGameArea.canvas.height - this.height - 20;

        for (let obs of gestioneOstacoli.lista) {
            if (this.speedY > 0 && 
                this.x + this.width > obs.x && 
                this.x < obs.x + obs.width &&
                this.y + this.height >= obs.y && 
                this.y + this.height <= obs.y + 20) {
                
                this.y = obs.y - this.height;
                this.speedY = 0;
                aTerra = true;
            }
        }

        if (this.y >= pavimentoY) {
            this.y = pavimentoY;
            this.speedY = 0;
            aTerra = true;
        }

        this.onGround = aTerra;

        if (this.x < 0) this.x = 0;
        if (this.x > myGameArea.canvas.width - this.width) this.x = myGameArea.canvas.width - this.width;
    },

    update: function() {
        if (Math.abs(this.speedX) > 0.2) {
            this.contaFrame++;
            if (this.contaFrame >= 6) {
                this.contaFrame = 0;
                this.actualFrame = (this.actualFrame + 1) % this.imageList.length;
                this.image = this.imageList[this.actualFrame];
            }
        }
    },

    crashWith: function(otherobj) {
        let precisione = 10;
        return !(this.y + this.height - precisione < otherobj.y || 
                 this.y + precisione > otherobj.y + otherobj.height || 
                 this.x + this.width - precisione < otherobj.x || 
                 this.x + precisione > otherobj.x + otherobj.width);
    }
};

function updateGameArea() {
    for (let i = 0; i < gestioneOstacoli.lista.length; i++) {
        let obs = gestioneOstacoli.lista[i];
        if (robot.crashWith(obs) && robot.y + robot.height > obs.y + 5) {
            myGameArea.stop();
            return;
        }
    }

    myGameArea.clear();
    myGameArea.frameNo = (myGameArea.frameNo || 0) + 1;
    punteggio = myGameArea.frameNo;

    if (punteggio >= 1000 && punteggio < 1050 && mondo == 1) { gestioneOstacoli.lista = []; mondo = 2; }
    if (punteggio >= 2000 && punteggio < 2050 && mondo == 2) { gestioneOstacoli.lista = []; mondo = 3; }

    let coloreCielo = (mondo == 2) ? "#000033" : (mondo == 3) ? "orange" : "skyblue";
    myGameArea.canvas.style.backgroundColor = coloreCielo;

    gestioneOstacoli.genera();
    gestioneOstacoli.aggiorna();

    let ctx = myGameArea.context;
    ctx.fillStyle = "#228B22";
    ctx.fillRect(0, myGameArea.canvas.height - 20, myGameArea.canvas.width, 20);

    ctx.font = "25px Arial";
    ctx.fillStyle = (mondo == 2) ? "white" : "black";
    ctx.fillText("MONDO: " + mondo + "  SCORE: " + punteggio, 20, 40);

    robot.newPos();
    robot.update();
    myGameArea.drawGameObject(robot);
}

function everyinterval(n) {
    return (myGameArea.frameNo / n) % 1 == 0;
}

function moveup() { 
    if (robot.onGround) {
        robot.speedY = robot.saltoForza;
        robot.onGround = false;
    }
}
function moveleft() { robot.speedX = -7; }
function moveright() { robot.speedX = 7; }
function clearmove() { robot.speedX = 0; }

window.addEventListener('keydown', function (e) {
    if (e.key == "ArrowUp" || e.key == "w") moveup();
    if (e.key == "ArrowLeft" || e.key == "a") moveleft();
    if (e.key == "ArrowRight" || e.key == "d") moveright();
});
window.addEventListener('keyup', function (e) {
    if (e.key == "ArrowLeft" || e.key == "a" || e.key == "ArrowRight" || e.key == "d") clearmove();
});