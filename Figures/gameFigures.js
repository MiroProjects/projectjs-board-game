var Figures = {};

var Hero = function(name, attack, armor, health, attackingSquares, speed){
    this.name = name;
    this.attack = attack,
    this.armor = armor,
    this.health = health,
    this.attackingSquares = attackingSquares,
    this.speed = speed;
};

Figures.getNewKnight = function(){
    return new Hero("K", 8, 3, 15, 1, 1);
};

Figures.getNewElf = function(){
    return new Hero("E", 5, 1, 10, 3, 3);
};

Figures.getNewDwarf = function(){
    return new Hero("D", 6, 2, 12, 2, 2);
};

Hero.prototype.addPlayer = function(player){
    this.player = player;
};