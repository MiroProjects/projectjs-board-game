//Creating FigureManager object for storing the canvas functions and properties
var FigureManager = new Object();

//Initialize function for the main properties
FigureManager.initialize = function(){
    this.canvas = document.getElementById("figureField");
    this.context = this.canvas.getContext("2d");
};

//Function for adding a function reference to the function which is going to be called in the event listener
FigureManager.addAFunctionToTheEventListener = function(callback){
    FigureManager.reference = callback;
};

//Function used in the event listener
var click = function(e){
    FigureManager.reference(e);
};

//Adds event listener and attaches the given function in (addAFunctionToTheEventListener()) as a callback in the event listener
FigureManager.addOnClickEvent = function(){
    this.canvas.addEventListener("click", click);
};

//Removes an event listeners
FigureManager.removeClickFunction = function(){
    this.canvas.removeEventListener("click", click);
};

//Sets the default font options
FigureManager.setDefaultFontOptions = function(){
    this.context.font = "50px Arial";
    this.context.fillStyle = "black";
};

//Clears all the figures on the FigureManager
FigureManager.clear = function(callback){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

//Places a figure on the current position
FigureManager.placeFigure = function(name, square){
    this.context.fillText(name, square.x + 25, square.y + 55);
};

//Sets the style of a square with an obstacle
FigureManager.setObstacle = function(square){
    this.context.beginPath();
    this.context.rect(square.x, square.y, square.width, square.height);
    this.context.fill();
};