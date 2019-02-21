//Creating CanvasManager object for storing the canvas functions and properties
var CanvasManager = new Object();

//Initialize function for the main properties
CanvasManager.initialize = function(canvasElementID){
    this.canvas = document.getElementById(canvasElementID);
    this.context = this.canvas.getContext("2d");
    this.arrayWithSquares = [];
};

//Adds event listener to the canvas
CanvasManager.addEventListenerToCanvas = function(){
    CanvasManager.canvas.addEventListener("click", function(e){
        var position = {
            x: e.clientX,
            y: e.clientY
          };

        CanvasManager.arrayWithSquares.forEach(square => {
            if (isClicked(position, square)) {
                alert(`Clicked on square: Col: ${square.col}, Row: ${square.row}`);
            }
        });
    });
};

//Creates the gamefield
CanvasManager.createGameField = function(){
    for (let row = 0; row < 7; row++) {
        for (let col = 0; col < 9; col++) {
            if (row >= 2 && row <= 4) {
                createASquare(col, row, true);
                continue;
            }
            createASquare(col, row);
        }
    }
};

//Creates one square of the gamefield
var createASquare = function(col, row, isBattleFieldFlag){
    var x = col * 85;
    var y = row * 85;
    var width = 85;
    var height = 85;

    CanvasManager.context.beginPath();
    if (isBattleFieldFlag) {
        CanvasManager.context.strokeStyle = "rgb(102, 51, 0)";
        CanvasManager.context.strokeRect(x, y, width, height);
        CanvasManager.addSquareToArray(new Square(x, y, width, height, col, row, true));
    }
    else{
        CanvasManager.context.fillStyle = ["rgb(232, 232, 176)", "rgb(102, 51, 0)"][(col + row) % 2];
        CanvasManager.context.fillRect(x, y, width, height);
        CanvasManager.addSquareToArray(new Square(x, y, width, height, col, row));
    }
    CanvasManager.context.closePath();
};

//Checks which square is clicked
var isClicked = function(position, square){
    return (square.x <= position.x && position.x <= square.x + square.width &&
           square.y <= position.y && position.y <= square.y + square.height);
};

//Adds square to the main array of elements
CanvasManager.addSquareToArray = function(square){
    this.arrayWithSquares.push(square);
};