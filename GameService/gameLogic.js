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
    Game.rounds = 0;
    //Two arrays for holding the order of the destroyed figures
    Game.destroyedPlayerAFigures = [];
    Game.destroyedPlayerBFigures = [];
};

//Functions to be called for the start of a new game
Game.startGame = function(){
    statistics.style["height"] = "330px";
    FigureManager.removeClickFunction();
    GameFieldManager.reset();
    FigureManager.clear();
    removeInfoManager();
    resetPlayers();
    this.currentPlayer = this.playerA;
    this.clickEventFigureDistribution();
    this.createGameField();
    createInfoManager(765, 425, 170);
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
var createInfoManager = function (width, height, top) {
    InfoManager.createInfoCanvas(width, height, top);
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

    //Add " ' " to the heroes' names so they are different
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
};

//Changes the statistics
var changeStatisticsOnDistribution = function(player){
    var text = "";
    text = `${player.name}'s Turn <br /><br /> Avaliable Heroes <br />`;
    for (let index = 0; index < player.heros.length; index++) {
        text += ` ${player.heros[index].name} `;     
    }
    text += "<div class='statisticsDistribution'>"
    text += "<p class='statisticsDistribution'>K/K' - Knight</p>";
    text += "<p class='statisticsDistribution'>E/E' - Elf</p>";
    text += "<p class='statisticsDistribution'>D/D' - Dwarf</p>";
    text += "</div>";

    statistics.innerHTML = text;
};

//Changes the statistics
var changeStatisticsOnPlay = function(player){
    var text = "";
    text = `${player.name}'s Turn <br /><ul><li id='attack'>Attack</li><li id='move'>Move</li><li id='heal'>Heal</li></ul>`;
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
    figure.addPlayer(Game.currentPlayer);
    var name = figure.name;
    square.addFigure(figure);
    FigureManager.placeFigure(name, square);
    Game.currentPlayer.heros.shift();
    Game.changeTurn();
    changeStatisticsOnDistribution(Game.currentPlayer);
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
    addOptions();
    Game.clickEventGamePlay();
    statistics.style["height"] = "300px";
    statistics.style["paddingTop"] = "80px";
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

        if (GameFieldManager.arrayWithSquares[index].obstacle) {
            FigureManager.setObstacle(GameFieldManager.arrayWithSquares[index]);
            countObstacles++;
        }
    }
};

//Function that adds event listener to the FigureManager for figure distribution
Game.clickEventFigureDistribution = function(){
    FigureManager.addAFunctionToTheEventListener(figureDistribution);
    FigureManager.addOnClickEvent();
};

//Generates a random number
var randomInteger = function(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
};

//Gets a free random position from the given array
var getAFreeRandomPosition = function(positions){
    //Generate a number from 18 to 44 - these are the battlefields' poitions
    var position = randomInteger(18, 45);
    if (positions.length > 0 && positions.includes(position)) {
        return getAFreeRandomPosition(positions);
    }
    return position;
};

//Generatse obstacles
var generateObstacles = function(){
    var positions = [];

    //Generate a number from 1 to 5
    var numberOfObstacles = randomInteger(1, 6);
    var obstacle = {name: "OBSTACLE"};
    for (let index = 0; index < numberOfObstacles; index++) {
        var freePosition = getAFreeRandomPosition(positions);
        positions.push(freePosition);
        GameFieldManager.arrayWithSquares[freePosition].addObstacle(obstacle);
    }
    return numberOfObstacles;
};

//Function that sets player's choice
var makeChoice = function (playerChoice) {
    if (Game.currentPlayer.choice) {
        alert(`You have made your choice: ${Game.currentPlayer.choice}`);
        return;
    }

    alert(`Your choice: ${playerChoice}`);
    Game.currentPlayer.choice = playerChoice;
};

//Adds to the HTML elemnts <li> click options
var addOptions = function(){
    var optionAttack = document.getElementById("attack");
    var optionMove = document.getElementById("move");
    var optionHeal = document.getElementById("heal");

    optionAttack.addEventListener("click", () => {makeChoice("Attack")});
    optionMove.addEventListener("click", () => {makeChoice("Move")});
    optionHeal.addEventListener("click", () => {makeChoice("Heal")});
};

//The main game
var gamePlay = function(e) {
    var position = {
        x: e.clientX,
        y: e.clientY
    };

    var boardSquares = GameFieldManager.arrayWithSquares;

    for (let index = 0; index < boardSquares.length; index++) {
        var square = boardSquares[index];
        if (square.isIntersected(position)) {
            if (square.figure && square.figure.player == Game.currentPlayer) {
                if (!Game.currentPlayer.choice) {
                    alert("First make a choice!");
                    return;
                }
                
                createInfoManager(765, 595);
                //The clicked figure from the FigureManager
                Game.clickedSquare = square;
                //Count the rounds
                Game.rounds++;
                if (Game.currentPlayer.choice == "Attack") {
                    //Event for making the attack
                    FigureManager.changeSelectedSquareColor(square);
                    InfoManager.addOnClickEvent(makeAttack);
                    return;
                }

                if (Game.currentPlayer.choice == "Move") {
                    showMoves(square);
                    //Event for making the move
                    FigureManager.changeSelectedSquareColor(square);
                    InfoManager.addOnClickEvent(makeMove);
                    return;
                }

                if (Game.currentPlayer.choice == "Heal") {
                    healAFigure();
                }
            }
        }
    }
};

//Performs a move
var makeMove = function(e){
    var position = {
        x: e.clientX,
        y: e.clientY
    };
    var boardSquares = GameFieldManager.arrayWithSquares;
    for (let index = 0; index < boardSquares.length; index++) {
        if (boardSquares[index].isIntersected(position)) {
            if (boardSquares[index].figure) {
                return;
            }

            if (boardSquares[index].obstacle) {
                return;
            }
            
            var row = boardSquares[index].row;
            var col = boardSquares[index].col;
            if (!checkIfSquareIsInRadius(row, col, Game.clickedSquare)) {
                return;
            }

            boardSquares[index].figure = Game.clickedSquare.figure;
            Game.clickedSquare.figure = null;
            break;
        }       
    }
    
    resetGameBoardForNextPlayer();
};

//Calls the main functions for reseting the board for the next player
var resetGameBoardForNextPlayer = function(){
    removeInfoManager();
    Game.currentPlayer.choice = null;
    Game.changeTurn();
    changeStatisticsOnPlay(Game.currentPlayer);
    resetFigureField();
    addOptions();
};

//Function for healing a figure
var healAFigure = function () {
    //Generate a number from 1 to 6
    var healingNumber = randomInteger(1, 7);
    Game.clickedSquare.figure.health += healingNumber;
    alert(`Player: ${Game.currentPlayer.name} healed his figure: ${Game.clickedSquare.figure.name} with ${healingNumber} health. Current figure's health is: ${Game.clickedSquare.figure.health}`);

    var die = randomInteger(1, 7);
    if (die % 2 != 0) {
        alert("You won another turn!");
        removeInfoManager();
        Game.currentPlayer.choice = null;
        return;
    }

    resetGameBoardForNextPlayer();
};

//Performs an attack
var makeAttack = function(e) {
    var position = {
        x: e.clientX,
        y: e.clientY
    };

    var boardSquares = GameFieldManager.arrayWithSquares;
    //Find the selected square to perform the attack
    for (let index = 0; index < boardSquares.length; index++) {
        var square = boardSquares[index];
        if (square.isIntersected(position)) {
            //If it is empty square do nothing
            if (square.figure == null && square.obstacle == null) {
                alert("Attack failed the target is neither figure nor obstacle!");
                break;
            }
    
            //Calc the distance to the figure
            var distance = Game.clickedSquare.figure.attackingSquares;
            var distanceWidth = Math.abs(square.row - Game.clickedSquare.row);
            var distanceHeight = Math.abs(square.col - Game.clickedSquare.col);
            if (((distanceWidth == distance) && (distanceHeight == 0)) || 
            ((distanceHeight == distance) && (distanceWidth == 0))) {
                
                //If it is on its diagonal then an attack cannot be performed
                if (excludeDiagonalAttack(square)) {
                    alert("The figure cannot attack from this position!");
                    break;
                }

                //If it is an obtsacle then destroy it
                if (square.obstacle) {
                    square.obstacle = null;
                    break;
                }

                //If the figures are yours then you cannot make the attack
                if (square.figure.player == Game.currentPlayer) {
                    alert("You cannot attack your figures!");
                    break;
                }
                
                //Generate a number from 1 to 6
                var die1 = randomInteger(1, 7);
                var die2 = randomInteger(1, 7);
                var die3 = randomInteger(1, 7);
                var diceSum = die1 + die2 + die3;
                var health = square.figure.health;
                if (diceSum == health) {
                    alert("Attack was unsuccessfull");
                    break;
                }

                //Calc the attack
                var attack =  Game.clickedSquare.figure.attack - square.figure.armor;
                if (diceSum == 3) {
                    var attack = Math.round(attack / 2);
                    square.figure.health -= attack;
                    alert("Attack was halved");
                }
                else{
                    square.figure.health -= attack;
                }

                alert(`Player: ${Game.currentPlayer.name} attacked the figure: ${square.figure.name} with ${Game.clickedSquare.figure.name} and the figure lost ${attack} points. Left health: ${square.figure.health}`);
                //If figure is destroyed
                if (square.figure.health <= 0) {
                    if (Game.currentPlayer == Game.playerA) {
                        Game.destroyedPlayerBFigures.push(square.figure);
                    }
                    else if(Game.currentPlayer == Game.playerB){
                        Game.destroyedPlayerAFigures.push(square.figure);
                    }
                    square.figure = null;
                }
                
                //If it is the last figure of one of the players
                if (isEndOfGame()) {
                    alert("This is the end of the game");
                    resetFigureField();
                    removeInfoManager();
                    createInfoManager(765, 595);
                    endOfGameStatistics();
                    return;
                }

                break;
            }
            alert("The figure cannot attack from this position!");
            break;
        }
    }

    resetGameBoardForNextPlayer();
};

//Resets the figure manager field for the next turn
var resetFigureField = function(){
    FigureManager.clear();
    var boardSquares = GameFieldManager.arrayWithSquares;
    for (let index = 0; index < boardSquares.length; index++) {
        if (boardSquares[index].figure) {
            FigureManager.placeFigure(boardSquares[index].figure.name, boardSquares[index]);
            continue;
        }

        if (boardSquares[index].obstacle) {
            FigureManager.setObstacle(boardSquares[index]);
        }
    }
};

//Function that displays the possible moves for a figure
var showMoves = function(square){
    var boardSquares = GameFieldManager.arrayWithSquares;
    for (let index = 0; index < boardSquares.length; index++) {
        var row = boardSquares[index].row;
        var col = boardSquares[index].col;

        var check = checkIfSquareIsInRadius(row, col, square);
        if (check) {
            InfoManager.addMoveInfo(boardSquares[index]);
        }
    }
};

//Function that checks if a square is in the figure's radius
var checkIfSquareIsInRadius = function(row, col, square){
    if (row == square.row && col == square.col) {
        return false;
    }

    if(square.figure.name.startsWith("E")){
        if (excludeCornersForElfFigure(row, col, square)) {
            return
        }
    }
    var a = Math.pow(row - square.row, 2);
    var b = Math.pow(col - square.col, 2);
    var c = Math.pow(square.figure.speed, 2);
    return (a + b) <= c;
};

//Excludes diagonal attacks
var excludeDiagonalAttack = function(square){
    var attackRadius = Game.clickedSquare.figure.attackingSquares;
    var rowToExcludeX1 = Game.clickedSquare.row - attackRadius;
    var colToExcludeY1 = Game.clickedSquare.col - attackRadius;
    var rowToExcludeX2 = Game.clickedSquare.row + attackRadius;
    var colToExcludeY2 = Game.clickedSquare.col + attackRadius;
    if (square.row == rowToExcludeX1 && square.col == colToExcludeY1) {
        return true;
    }

    if (square.row == rowToExcludeX1 && square.col == colToExcludeY2) {
        return true;
    }

    if (square.row == rowToExcludeX2 && square.col == colToExcludeY1) {
        return true;
    }

    if (square.row == rowToExcludeX2 && square.col == colToExcludeY2) {
        return true;
    }
    return false;
};

//Function that excludes the corners for the elf figure
var excludeCornersForElfFigure = function(row, col, square){
    var rowToExcludeX1 = square.row - 2;
    var colToExcludeY1 = square.col - 2;
    var rowToExcludeX2 = square.row + 2;
    var colToExcludeY2 = square.col + 2;
    if (row == rowToExcludeX1 && col == colToExcludeY1) {
        return true;
    }

    if (row == rowToExcludeX1 && col == colToExcludeY2) {
        return true;
    }

    if (row == rowToExcludeX2 && col == colToExcludeY1) {
        return true;
    }

    if (row == rowToExcludeX2 && col == colToExcludeY2) {
        return true;
    }
    return false;
};

//Function that adds event listener to the FigureManager for the main game play
Game.clickEventGamePlay = function(){
    FigureManager.addAFunctionToTheEventListener(gamePlay);
    FigureManager.addOnClickEvent();
};

//Calculates the points of the winner based on the health of his alive heroes
var calcPoints = function(){
    boardSquares = GameFieldManager.arrayWithSquares;
    var points = 0
    for (let index = 0; index < boardSquares.length; index++) {
        if (boardSquares[index].figure) {
            points += boardSquares[index].figure.health;
        }
    }
    return points;
};

//Changes tha statistics for the end of the game
var endOfGameStatistics = function(){
    var text = "";
    text += `<p class='endGameStatistics'>Winner's points ${calcPoints()}</p>`;
    text += `<p class='endGameStatistics'>Game rounds ${Game.rounds}</p>`;
    text += `<p class='endGameStatistics'>Player A's destroyed figures</p>`;
    for (let index = 0; index < Game.destroyedPlayerAFigures.length; index++) { 
        if (index == Game.destroyedPlayerAFigures.length - 1) {
            text += `<span>${Game.destroyedPlayerAFigures[index].name}<span>`;
            break;
        }
        text += `<span>${Game.destroyedPlayerAFigures[index].name}|<span>`;   
    }
    text += `<p class='endGameStatistics'>Player B's destroyed figures</p>`;
    for (let index = 0; index < Game.destroyedPlayerBFigures.length; index++) {
        if (index == Game.destroyedPlayerBFigures.length - 1) {
            text += `<span>${Game.destroyedPlayerBFigures[index].name}<span>`;
            break;
        }
        text += `<span>${Game.destroyedPlayerBFigures[index].name}|<span>`;        
    }
    statistics.style["height"] = "300px";
    statistics.innerHTML = text;
};

//Checks for the end of the game
var isEndOfGame = function(){
    var boardSquares = GameFieldManager.arrayWithSquares;
    var isPlayerAAlive = false;
    var isPlayerBAlive = false;

    for (let index = 0; index < boardSquares.length; index++) {
        if (boardSquares[index].figure) {
            if (boardSquares[index].figure.player == Game.playerA) {
                isPlayerAAlive = true;
            }
            else{
                isPlayerBAlive = true;
            }
        }

        if (isPlayerAAlive && isPlayerBAlive) {
            return false;
        }
    }
    return true;
};