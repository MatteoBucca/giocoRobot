var robot;
var punteggio = 0;
var mondo = 1;
var gravita = 0.8;
var attrito = 0.9;

function startGame() {
    myGameArea.start();
    robot.loadImages();
}

robot = {
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
reset: function() {
        document.getElementById("menuMorte").style.display = "none";
        
        punteggio = 0;
        mondo = 1;
        myGameArea.frameNo = 0;
        gestioneOstacoli.lista = []; 
        
        this.x = 100;
        this.y = 120;
        this.speedX = 0;
        this.speedY = 0;
        this.onGround = false;

        myGameArea.stop(); 
        myGameArea.start(); 
    },
    loadImages: function() {
        for (imgPath of running) {
            var img = new Image(this.width, this.height);
            img.src = imgPath;
            this.imageList.push(img);
        }
        this.image = this.imageList[this.actualFrame];
    },

    salta: function() {
        if (this.onGround) {
            this.speedY = this.saltoForza;
            this.onGround = false;
        }
    },

    vaiSinistra: function() {
        this.speedX = -7;
    },

    vaiDestra: function() {
        this.speedX = 7;
    },

    fermati: function() {
        this.speedX = 0;
    },

    newPos: function() {
        this.speedY += gravita;
        this.speedX *= attrito;
        this.x += this.speedX;
        this.y += this.speedY;

        let aTerra = false;
        let pavimentoY = myGameArea.canvas.height - this.height - 20;

        for (let i = 0; i < gestioneOstacoli.lista.length; i++) {
            let obs = gestioneOstacoli.lista[i];
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

        if (this.x < 0) {
            this.x = 0;
        }
        if (this.x > myGameArea.canvas.width - this.width) {
            this.x = myGameArea.canvas.width - this.width;
        }
    },

    update: function() {
            this.contaFrame++;
            if (this.contaFrame >= 6) {
                this.contaFrame = 0;
                this.actualFrame = (this.actualFrame + 1) % this.imageList.length;
                this.image = this.imageList[this.actualFrame];
            
        }
    },

    crashWith: function(otherobj) {
        let precisione = 10;

        let mioSinistra = this.x + precisione;
        let mioDestra = this.x + this.width - precisione;
        let mioSopra = this.y + precisione;
        let mioSotto = this.y + this.height - precisione;

        let ostSinistra = otherobj.x;
        let ostDestra = otherobj.x + otherobj.width;
        let ostSopra = otherobj.y;
        let ostSotto = otherobj.y + otherobj.height;

        if (mioSotto < ostSopra ||  mioSopra > ostSotto ||  mioDestra < ostSinistra || mioSinistra > ostDestra) {
            return false; 
        }
        return true; 
    }
};

function updateGameArea() {
    for (let i = 0; i < gestioneOstacoli.lista.length; i++) {
        let obs = gestioneOstacoli.lista[i];
        if (robot.crashWith(obs)) {
            if (robot.y + robot.height > obs.y + 5) {
                myGameArea.stop();
        document.getElementById("menuMorte").style.display = "flex";                
    return;
            }
        }
    }

    myGameArea.clear();
    myGameArea.frameNo = (myGameArea.frameNo || 0) + 1;
    punteggio = myGameArea.frameNo;

    if (punteggio >= 1000 && punteggio < 1050 && mondo == 1) { 
        gestioneOstacoli.lista = []; 
        mondo = 2; 
    }
    if (punteggio >= 2000 && punteggio < 2050 && mondo == 2) { 
        gestioneOstacoli.lista = []; 
        mondo = 3; 
    }

    let coloreCielo;
    if (mondo == 2) {
        coloreCielo = "#000033";
    } else if (mondo == 3) {
        coloreCielo = "orange";
    } else {
        coloreCielo = "skyblue";
    }
    myGameArea.canvas.style.backgroundColor = coloreCielo;

    gestioneOstacoli.genera();
    gestioneOstacoli.aggiorna();

    let ctx = myGameArea.context;
    ctx.fillStyle = "#228B22";
    ctx.fillRect(0, myGameArea.canvas.height - 20, myGameArea.canvas.width, 20);

    let coloreTesto;
    if (mondo == 2) {
        coloreTesto = "white";
    } else {
        coloreTesto = "black";
    }
    ctx.font = "25px Arial";
    ctx.fillStyle = coloreTesto;
    ctx.fillText("MONDO: " + mondo + "  SCORE: " + punteggio, 20, 40);

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

window.addEventListener('keydown', function (e) {
    if (e.key == "ArrowUp" || e.key == "w") { 
        robot.salta(); 
    }
    if (e.key == "ArrowLeft" || e.key == "a") { 
        robot.vaiSinistra(); 
    }
    if (e.key == "ArrowRight" || e.key == "d") {
         robot.vaiDestra(); 
        }
});

window.addEventListener('keyup', function (e) {
    if (e.key == "ArrowLeft" || e.key == "a" || e.key == "ArrowRight" || e.key == "d") {
        robot.fermati();
    }
});