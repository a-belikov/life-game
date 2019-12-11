const e = id => document.getElementById(id);


class Cell {
    constructor (field, col, row) {
        this.field = field;
        this.col = col;
        this.row = row;
        this.isLive = false;
        // Get cell grapthics sizes
        this.width = this.field.cellWidth;
        this.height = this.field.cellHeight;
        
        // Get cell grapthics coordinats
        this.x = this.col * this.width;
        this.y = this.row * this.height;

    }

    draw() {
        // console.log('draw',this.x,this.y);
        if (this.isLive) {
            this.field.ctx.fillStyle = '#44aa44';            
        } else {
            this.field.ctx.fillStyle = '#eee';

        }
        this.field.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    die() {
        this.isLive = false;        
    }
    
    live() {
        this.isLive = true;        
    }

    
}

class Field {
    constructor (e, cols, rows) {
        this.cols = cols;
        this.rows = rows;
        this.ctx = e.getContext('2d');
        this.width = this.ctx.canvas.clientHeight;
        this.height = this.ctx.canvas.clientHeight;

        this.cellWidth = this.width/this.cols;
        this.cellHeight = this.height/this.rows;
        console.log(this.cellHeight);
        
        this.cells = [];

        for (let j=0;j<rows;j++) {
            for (let i=0;i<cols;i++) {
                this.cells.push(new Cell(this,i,j)) ;
            }
        }
        // console.log(this.cells); ;
        e.addEventListener('mousedown', (e) => {
            this.getCursorPosition(canvas, e);
        });
    }
    
    fillRandom (fillCoeff) {
        for (let cell of this.cells) {
            cell.isLive =  (Math.random() <= fillCoeff); 
        }
    }
    fillSquare () {
        let inx=0;

        for (let j=0;j<this.rows;j++) {
            for (let i=0;i<this.cols;i++) {
                this.cells[j*this.cols+i].live();

                if (i%3==0 || j%3==0) {
                    this.cells[j*this.cols+i].die();



                }
            }
        }
        
    }

    step () {
        let liveList = this.getMustLive();
        let diedList = this.getMustDie();

        for (let cell of liveList) {
            cell.live();
        }
        for (let cell of diedList) {
            cell.die();
        }
        field.draw();        
    }

    draw () {
        for (let cell of this.cells) {
            cell.draw() ;
        }
    }


    getMustDie () {
        let mustDie = [];
        for (let cell of this.cells) {
            if (cell.isLive) {
                let neighboursCount = this.neighboursCount(cell);
                if (neighboursCount != 2 && neighboursCount != 3 ) {
                    mustDie.push(cell);
                }
            }
        }
        return mustDie;
    }
    
    getMustLive () {
        let mustLive = [];
        for (let cell of this.cells) {
            if (!cell.isLive) {
                let neighboursCount = this.neighboursCount(cell);
                if (neighboursCount == 3) {
                    mustLive.push(cell);
                }
            }
        }
        return mustLive;
    }

    neighboursCount(cell) {
        let liveCount = 0;
        for (let i of [-1,0,1]) {
            for (let j of [-1,0,1]) {
                if (i!=0 || j!=0) {
                    let cellNeighbour = this.getCellAtPosition(cell.col+i,cell.row+j);
                    if (cellNeighbour!== undefined && cellNeighbour.isLive) {
                        liveCount++;
                    }
                }
            }
        }

        return liveCount;
    }

    getCellAtPosition(col,row) {
        if (col<0 || col>this.cols-1) {
            return undefined;
        }
        if (row<0 || row>this.rows-1) {
            return undefined;
        }
        
        let index = row*this.cols + col;
        
        return this.cells[index];
    }

    getCursorPosition(canvas, event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        console.log("x: " + x + " y: " + y);

        let col = Math.floor(x/this.cellWidth);
        let row = Math.floor(y/this.cellHeight);

        let cell = this.getCellAtPosition(col,row);
        console.log(col,row,this.neighboursCount(cell));

        cell.isLive = !cell.isLive;
        cell.draw();
        
    }
    
}


window.timerId = false;
var canvas = e('canvas');

e('newfield').onclick = function() {
    let cols = parseFloat(e('colscount').value);    
    let rows = parseFloat(e('rowscount').value);
    
    field = new Field(canvas,cols,rows);
    field.draw() ;
};

e('fillrandom').onclick = function() {
    field.fillRandom(parseFloat(e('fillrandomcoeff').value));
    field.draw() ;
};

e('fillsquare').onclick = function() {
    field.fillSquare();
    field.draw() ;
};

e('startstop').onclick = function() {
    if(window.timerId) {
        clearTimeout(timerId);
        window.timerId = false;
        console.log('stop');
        
    } else {
        console.log('Start');
        window.timerId = setInterval(function( ) {
            field.step() ;
        },50);
    }
};


e('newfield').click();
field.fillRandom(parseFloat(e('fillrandomcoeff').value));
field.draw() ;

document.onkeydown = function(event) { 
    if (event) {
        if (event.keyCode == 32 || event.which == 32) {
            e('startstop').click();
        }
    }  
};


