//Constructor function for creating squares
var Square = function(squareProperties){
    this.x = squareProperties.x;
    this.y = squareProperties.y;
    this.width = squareProperties.width;
    this.height = squareProperties.height;
    this.col = squareProperties.col,
    this.row = squareProperties.row;
    this.isBattleField = squareProperties.isBattleField;
};

//Adding a figure to the square
Square.prototype.addFigure = function(figure){
    this.figure = figure;
};

//Checks if the square is clicked based on the position object
Square.prototype.isIntersected = function(position) {
    return (this.x <= position.x && position.x <= this.x + this.width &&
        this.y <= position.y && position.y <= this.y + this.height);
};

//Adding an obstacle to the square
Square.prototype.addObstacle = function(obstacle){
    this.obstacle = obstacle;
};