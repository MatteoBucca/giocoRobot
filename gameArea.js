var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = 800;
        this.canvas.height = 400;
        this.context = this.canvas.getContext("2d");
        document.getElementById("game-wrapper").appendChild(this.canvas);
        this.interval = setInterval(updateGameArea, 20); 
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    drawGameObject: function(gameObject) {
        if (gameObject.image) {
            this.context.drawImage(
                gameObject.image,
                gameObject.x,
                gameObject.y,
                gameObject.width,
                gameObject.height
            );
        }
    },
    stop: function() {
        clearInterval(this.interval);
    }
};