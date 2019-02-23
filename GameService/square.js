Square = function(squareProperties){
    this.x = squareProperties.x;
    this.y = squareProperties.y;
    this.width = squareProperties.width;
    this.height = squareProperties.height;
    this.col = squareProperties.col,
    this.row = squareProperties.row;
    this.isBattleField = squareProperties.isBattleField;
};

Square.prototype.addFigure = function(figure){
    this.figure = figure;
};

Square.prototype.isIntersected = function(position) {
    return (this.x <= position.x && position.x <= this.x + this.width &&
        this.y <= position.y && position.y <= this.y + this.height);
};