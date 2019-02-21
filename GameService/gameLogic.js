//Create game object to save the main game info
var Game = new Object();

//Objects for the two players
Game.playerA = {};
Game.playerB = {};

//Saves the current player's turn
Game.currentPlayer = null;

//Logic and functions to be called for the start of the game
Game.startGame = function(){
    CanvasManager.initialize("gameField");
    CanvasManager.createGameField();
    CanvasManager.addEventListenerToCanvas();
    this.currentPlayer = this.playerA;
    playerACharacteristics();
    playerBCharacteristics();
    this.statistics = document.getElementById("statistics");
    changeStatistics(this.currentPlayer);
};

//Players A's characteristics
var playerACharacteristics = function(){
    Game.playerA.name = "Player A";
    Game.playerA.heros = [
        Figures.getNewKnight(), Figures.getNewKnight(), 
        Figures.getNewDwarf(), Figures.getNewDwarf(), 
        Figures.getNewElf(), Figures.getNewElf()];

    Game.playerB.name = "Player B";
    Game.playerB.heros = [
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

//Changes the players turns
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