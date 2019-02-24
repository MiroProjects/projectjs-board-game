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
    //this.clickEventFigureDistribution();
};

//Functions to be called for the start of a new game
Game.startGame = function(){
    FigureManager.removeClickFunction();
    GameFieldManager.reset();
    FigureManager.clear();
    removeInfoManager();
    resetPlayers();
    this.currentPlayer = this.playerA;
    this.clickEventFigureDistribution();
    this.createGameField();
    createInfoManager();
    InfoManager.addRedSquares();
    changeStatisticsOnDistribution(this.currentPlayer);
};

//If info manager canvas exists remove it 
var removeInfoManager = function(){
    if (InfoManager.canvas) {
        InfoManager.removeInfoCanvas();
    }
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

    changeStatisticsOnDistribution(this.currentPlayer);
};

//Changes the statistics
var changeStatisticsOnDistribution = function(player){
    var text = "";
    text = `${player.name}'s Turn <br /><br /> Avaliable Heroes: <br />`;
    for (let index = 0; index < player.heros.length; index++) {
        text += ` ${player.heros[index].name} `;     
    }

    statistics.innerHTML = text;
};

//Changes the statistics
var changeStatisticsOnPlay = function(player){
    var text = "";
    text = `${player.name}'s Turn <br /><ul><li>Attack</li><li>Move</li><li>Heal</li></ul>`;

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
    GameFieldManager.updateSquare(square);
    FigureManager.placeFigure(name, square);
    Game.currentPlayer.heros.shift();
    Game.changeTurn();
    var arePlaced = checkIfAllFiguresArePlaced();
    if (arePlaced) {
        afterFiguresArePlaced();
        return;
    }
    changeInfoManagerPosition();
};

//Checks if all figures are placed
var checkIfAllFiguresArePlaced = function(){
    if (Game.playerA.heros.length == 0 && Game.playerB.heros.length == 0) {
        return true;
    }
    return false;
};

//Logic after all figures are placed
var afterFiguresArePlaced = function(){
    removeInfoManager();
    FigureManager.removeClickFunction();
    placeAllObstacles();
    changeStatisticsOnPlay(Game.currentPlayer);
};

//Place all generated obstacles
var placeAllObstacles = function(){
    var numberOfGeneratedObstacles = generateObstacles();
    var countObstacles = 0;
    for (let index = 18; index < 45; index++) {
        //If all generated obstacles are placed then there is no need to check the other squares
        if (countObstacles == numberOfGeneratedObstacles) {
            return;
        }

        if (GameFieldManager.arrayWithSquares[index].figure) {
            FigureManager.setObstacle(GameFieldManager.arrayWithSquares[index]);
            countObstacles++;
        }
    }
};

//Function for the figure distribution
Game.clickEventFigureDistribution = function(){
    FigureManager.addAFunctionToTheEventListener(figureDistribution);
    FigureManager.addOnClickEvent();
};

//Generate a random number
var randomInteger = function(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
};

//Get a free random position
var getAFreeRandomPosition = function(positions){
    //Generate a number from 18 to 44 - these are the battlefields' poitions
    var position = randomInteger(18, 45);
    if (positions.length > 0 && positions.includes(position)) {
        return getAFreeRandomPosition(positions);
    }
    return position;
};

//Generate obstacles
var generateObstacles = function(){
    var positions = [];

    //Generate a number from 1 to 5
    var numberOfObstacles = randomInteger(1, 6);
    for (let index = 0; index < numberOfObstacles; index++) {
        var freePosition = getAFreeRandomPosition(positions);
        positions.push(freePosition);
        GameFieldManager.arrayWithSquares[freePosition].figure = "OBSTACLE";
    }
    return numberOfObstacles;
};