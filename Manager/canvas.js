var CanvasManager = new Object();

CanvasManager.initialize = function(canvasElementID){
    this.canvas = document.getElementById(canvasElementID);
    this.context = this.canvas.getContext("2d");
};

CanvasManager.createGameField = function(){
    for (let row = 0; row < 7; row++) {
        for (let col = 0; col < 9; col++) {
            if (row >= 2 && row <= 4) {
                createSquare(col, row, "rgb(102, 51, 0)");
                continue;
            }

            createSquare(col, row);
        }
    }
};

var createSquare = function(col, row, color){
    CanvasManager.context.beginPath();
    
    if (color != null) {
        CanvasManager.context.strokeStyle = color;
        CanvasManager.context.strokeRect(col * 85, row * 85, 85, 85);
    }
    else{
        CanvasManager.context.fillStyle = ["rgb(232, 232, 176)", "rgb(102, 51, 0)"][(col + row) % 2];
        CanvasManager.context.fillRect(col * 85, row * 85, 85, 85);
    }

    CanvasManager.context.closePath();
};


