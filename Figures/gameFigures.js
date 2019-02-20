var Figures = {};

var Hero = function(attack, armor, health, attackingSquares, speed){
    this.attack = attack,
    this.armor = armor,
    this.health = health,
    this.attackingSquares = attackingSquares,
    this.speed = speed;
};

Figures.getNewKnight = function(){
    return new Hero(8, 3, 15, 1, 1);
};

Figures.getNewElf = function(){
    return new Hero(5, 1, 10, 3, 3);
};

Figures.getNewDwarf = function(){
    return new Hero(6, 2, 12, 2, 2);
};
