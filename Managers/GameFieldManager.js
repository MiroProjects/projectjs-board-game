//Creating GameFieldManager object for storing the canvas functions and properties
var GameFieldManager = new Object();

//Initialize function for the main properties
GameFieldManager.initialize = function(){
    this.canvas = document.getElementById("gameField");
    this.context = this.canvas.getContext("2d");
    this.arrayWithSquares = [];
};

//Adds a square to the main array of elements
GameFieldManager.addSquareToArray = function(square){
    this.arrayWithSquares.push(square);
};

//Resets the whole game field
GameFieldManager.reset = function(){
    this.arrayWithSquares = [];
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
};