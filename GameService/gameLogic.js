//Create a game object to save the main game logic
var Game = new Object();

//Logic and functions to be called for the initialization of the game
Game.initialize = function () {
    //Objects for the two players
    this.playerA = null;
    this.playerB = null;

    //Saves the current player's turn
    this.currentPlayer = null;

    GameFieldManager.initialize();
    FigureManager.initialize();
    FigureManager.setDefaultFontOptions();
    this.statistics = document.getElementById("statistics");
    this.createGameField();
};

//Functions to be called for the start of a new game
Game.startGame = function(){
    GameFieldManager.reset();
    FigureManager.clear();
    resetPlayers();
    this.currentPlayer = this.playerA;
    this.createGameField();
    this.figureDistribution();
    createInfoManager();
    InfoManager.addRedSquares();
    changeStatistics(this.currentPlayer);
};

//Resets the two player objects
var resetPlayers = function(){
    Game.playerA = {};
    Game.playerB = {};
    playerACharacteristics();
    playerBCharacteristics();
};

//Creates and initializes an InfoManager
var createInfoManager = function () {
    InfoManager.createInfoCanvas(170);
    InfoManager.initialize();
};

//Changes the InfoManager's top position
var changeInfoManagerPosition = function(){
    if (Game.currentPlayer == Game.playerA) {
        InfoManager.setTopPosition(170);
    }
    else if (Game.currentPlayer == Game.playerB){
        InfoManager.setTopPosition(0);
    }
};

//Players A's characteristics
var playerACharacteristics = function(){
    Game.playerA.name = "Player A";
    Game.playerA.heros = [
        Figures.getNewKnight(), Figures.getNewKnight(), 
        Figures.getNewDwarf(), Figures.getNewDwarf(), 
        Figures.getNewElf(), Figures.getNewElf()];
};

//Players B's characteristics
var playerBCharacteristics = function(){
    Game.playerB.name = "Player B";
    Game.playerB.heros = [
        Figures.getNewKnight(), Figures.getNewKnight(), 
        Figures.getNewDwarf(), Figures.getNewDwarf(), 
        Figures.getNewElf(), Figures.getNewElf()];

    //Add " ' " to the heroes' names so they are be different
    for (let index = 0; index < Game.playerB.heros.length; index++) {
        Game.playerB.heros[index].name += '\'';
    }
};

//Creates the gamefield
Game.createGameField = function(){
    for (let row = 0; row < 7; row++) {
        for (let col = 0; col < 9; col++) {
            if (row >= 2 && row <= 4) {
                createASquare(col, row, true);
                continue;
            }
            createASquare(col, row, false);
        }
    }
};

//Creates one square of the gamefield
var createASquare = function(col, row, isBattleFieldFlag){
    var x = col * 85;
    var y = row * 85;
    var width = 85;
    var height = 85;

    GameFieldManager.context.beginPath();
    GameFieldManager.context.rect(x, y, width, height);

    if (isBattleFieldFlag) {
        GameFieldManager.context.strokeStyle = "rgb(102, 51, 0)";
        GameFieldManager.context.stroke();
    }
    else{
        GameFieldManager.context.fillStyle = ["rgb(232, 232, 176)", "rgb(102, 51, 0)"][(col + row) % 2];
        GameFieldManager.context.fill();
    }

    //Saves this square to the array with board fields in the GameFieldManager
    GameFieldManager.addSquareToArray(new Square({
        x: x,
        y: y,
        width: width,
        height: height,
        col: col,
        row: row,
        isBattleField: isBattleFieldFlag
    }));

    GameFieldManager.context.closePath();
};

//Changes the players' turns
Game.changeTurn = function(){
    if (this.currentPlayer == this.playerA) {
        this.currentPlayer = this.playerB;
    } 
    else if (this.currentPlayer == this.playerB) {
        this.currentPlayer = this.playerA;
    }

    changeStatistics(this.currentPlayer);
};

//Changes the statistics
var changeStatistics = function(player){
    var text = "";
    text = `${player.name}'s Turn <br /><br /> Avaliable Heroes: <br />`;
    for (let index = 0; index < player.heros.length; index++) {
        text += ` ${player.heros[index].name} `;     
    }

    statistics.innerHTML = text;
};

//Distributes the figures
var figureDistribution = function(e) {
    var position = {
        x: e.clientX,
        y: e.clientY
    };

    var boardSquares = GameFieldManager.arrayWithSquares;

    for (let index = 0; index < boardSquares.length; index++) {
        var square = boardSquares[index];
        if (square.isIntersected(position)) {
            //Checks if on this position there is already a figure placed
            if (square.figure) {
                alert("There is already a figure placed there!");
                return;
            }

            placeFigure(square);
            return;
        }
    }
};

//Logic for placing the figure on the current position
var placeFigure = function(square){
    var figure = Game.currentPlayer.heros[0];
    var name = figure.name;
    square.addFigure(figure);
    GameFieldManager.updateSquare();
    FigureManager.placeFigure(name, square);
    Game.currentPlayer.heros.shift();
    checkIfAllFiguresArePlaced();
    Game.changeTurn();
    changeInfoManagerPosition();
};

//Checks if all figures are placed
var checkIfAllFiguresArePlaced = function(){
    if (Game.playerA.heros.length == 0 && Game.playerB.heros.length == 0) {
        InfoManager.removeInfoCanvas();
        //Logic for another clicking...
    }
};

//Function for the figure distribution
Game.figureDistribution = function(){
    FigureManager.addEventListenerToCanvas(figureDistribution);
};