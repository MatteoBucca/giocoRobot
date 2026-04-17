var gestioneOstacoli = {
    lista: [],
    
    genera: function() {
        if (everyinterval(50)) {
            let x = myGameArea.canvas.width;
            let pY = myGameArea.canvas.height - 20;
            let scelta = Math.floor(Math.random() * 4);
            let coloreTubi = (mondo == 2) ? "darkgreen" : (mondo == 3) ? "#b22222" : "green";

            if (scelta == 0) {
                this.lista.push(new obstacleComponent(45, 70, x, pY - 70, coloreTubi, "tubo"));
            } else if (scelta == 1) {
                for(let i=0; i<3; i++) {
                    this.lista.push(new obstacleComponent(35, 35, x + (i*35), pY - 130, "#CD853F", "cubo"));
                }
            } else if (scelta == 2) {
                this.lista.push(new obstacleComponent(30, 30, x, pY - 30, "darkred", "nemico"));
            } else {
                this.lista.push(new obstacleComponent(25, 100, x, pY - 100, "#555", "palo"));
            }
        }
    },

    aggiorna: function() {
        for (let i = 0; i < this.lista.length; i++) {
            this.lista[i].x -= (4 + mondo);
            this.disegna(this.lista[i]);
        }
    },

    disegna: function(obs) {
        let ctx = myGameArea.context;
        ctx.fillStyle = "black";
        ctx.fillRect(obs.x - 2, obs.y - 2, obs.width + 4, obs.height + 4);
        ctx.fillStyle = obs.colore;
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

        if (obs.tipo == "cubo") {
            ctx.fillStyle = "rgba(0,0,0,0.2)";
            ctx.fillRect(obs.x + 5, obs.y + 5, obs.width - 10, obs.height - 10);
        }
        if (obs.tipo == "tubo") {
            ctx.fillStyle = "black";
            ctx.fillRect(obs.x - 6, obs.y, obs.width + 12, 15);
            ctx.fillStyle = obs.colore;
            ctx.fillRect(obs.x - 4, obs.y + 2, obs.width + 8, 11);
        }
    }
};

function obstacleComponent(width, height, x, y, colore, tipo) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.colore = colore;
    this.tipo = tipo;
}