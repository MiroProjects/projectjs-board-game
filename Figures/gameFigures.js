//Object for getting the figures
var Figures = {};

//Constructor function for the figures(heroes)
var Hero = function(name, attack, armor, health, attackingSquares, speed){
    this.name = name;
    this.attack = attack,
    this.armor = armor,
    this.health = health,
    this.attackingSquares = attackingSquares,
    this.speed = speed;
};

//Creating a new knight
Figures.getNewKnight = function(){
    return new Hero("K", 8, 3, 15, 1, 1);
};

//Creating a new elf
Figures.getNewElf = function(){
    return new Hero("E", 5, 1, 10, 3, 3);
};

//Creating a new dwarf
Figures.getNewDwarf = function(){
    return new Hero("D", 6, 2, 12, 2, 2);
};

//Adding the player to the current figure
Hero.prototype.addPlayer = function(player){
    this.player = player;
};