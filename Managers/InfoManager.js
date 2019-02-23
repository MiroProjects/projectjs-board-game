//Creating InfoManager object for storing the canvas functions and properties
var InfoManager = new Object();

//Creates canvas dynamically
InfoManager.createInfoCanvas = function (top) {
    var canvas = document.createElement('canvas');

    canvas.id = "infoField";
    canvas.width = 765;
    canvas.height = 425;
    canvas.style.zIndex = 3;
    canvas.style.position = "absolute";
    canvas.style.left = 0;
    canvas.style.top = `${top}px`;

    var containerDiv = document.getElementById("canvasContainer");
    containerDiv.appendChild(canvas);
};

//Removes canvas dynamically
InfoManager.removeInfoCanvas = function(){
    var containerDiv = document.getElementById("canvasContainer");
    containerDiv.removeChild(this.canvas);
};

//Initialize function for the main properties
InfoManager.initialize = function(){
    this.canvas = document.getElementById("infoField");
    this.context = this.canvas.getContext("2d");
};

//Sets the top position
InfoManager.setTopPosition = function(top){
    this.canvas.style.top = `${top}px`;
}

//Adds red squares
InfoManager.addRedSquares = function(){
    setStyleForRedSquares();

    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 9; col++) {
            var x = col * 85;
            var y = row * 85;
            InfoManager.context.beginPath();
            InfoManager.context.rect(x, y, 85, 85);
            InfoManager.context.fillText("X", x + 25, y + 55);
            InfoManager.context.fill();
        }
    }
};

//Sets the style for the red squares
var setStyleForRedSquares = function(){
    InfoManager.context.fillStyle = "rgba(255, 51, 51, 0.5)";
    InfoManager.context.font = "50px Arial";
};