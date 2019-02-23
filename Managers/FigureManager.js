//Creating FigureManager object for storing the canvas functions and properties
var FigureManager = new Object();

//Initialize function for the main properties
FigureManager.initialize = function(){
    this.canvas = document.getElementById("figureField");
    this.context = this.canvas.getContext("2d");
};

//Adds event listener to the canvas
FigureManager.addEventListenerToCanvas = function(callback){
    this.canvas.addEventListener("click", function(e){callback(e)});
};

//Sets the default font options
FigureManager.setDefaultFontOptions = function(){
    this.context.font = "50px Arial";
    this.context.fillStyle = "black";
};

//Clears all the figures on the FigureManager
FigureManager.clear = function(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

//Places a figure on the current position
FigureManager.placeFigure = function(name, square){
    this.context.fillText(name, square.x + 25, square.y + 55);
};