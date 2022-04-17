class Tetris{
    constructor($target,ROW,COL){
        this.$target = $target;
        this.ROW = ROW , this.COL = COL;
        this.playGround = document.createElement('div');
        this.movingBlock = null;
        this.tempMovingBlock = null;
    }
    init = () =>{
        this.$target.appendChild(this.playGround);
        this.playGround.className= 'playGround';
        this.playGround.style.width = `${this.$target.offsetWidth*0.5}px`;
        this.movingBlock = {
            type:'tree',
            direction : 0,
            top:0,
            left:0,
        }
        this.tempMovingBlock = {...this.movingBlock};
        const {playGround,ROW} = this;
        const height = this.$target.offsetWidth*0.5 / this.COL;
        for(let i=0; i<ROW; i++){
            const li = document.createElement('li');
            li.style.height = `${height}px`;
            li.appendChild( this.prependLine() );
            playGround.prepend(li);
            console.log('1');
        }
        this.event();
        this.renderBlock();
    }
    prependLine = () =>{
        const {COL} = this;
        const row = document.createElement('ul');
        for(let i=0; i<COL; i++){
            const li = document.createElement('li');
            row.appendChild(li);
        }
        return row;
    }
    renderBlock = () =>{
        const {type,direction,top,left} = this.tempMovingBlock;
        const currentBlock = document.querySelectorAll('.moving');
        currentBlock.forEach(block => block.classList.remove(type,'moving'))
        console.log(currentBlock);
        this.BLOCKS[type][direction].forEach(([y,x])=>{
            console.log(y,x);
            const [ny,nx] = [y+top,x+left];
            this.playGround.childNodes[ny].children[0].childNodes[nx].classList.add(type,'moving');
        })
    }
    moveBlock = (moveType,amount) =>{
        console.log(-1);
        this.tempMovingBlock[moveType] += amount;
        this.renderBlock();
    }
    event = () =>{
        document.addEventListener('keydown',e =>{
            console.log(e);
            switch(e.keyCode){
                case 37 : return this.moveBlock('left',-1);
                case 38 : return this.moveBlock('top',-1);
                case 39 : return this.moveBlock('left',1);
                case 40 : return this.moveBlock('top',1);
                default : break;
            }
            console.log(this.tempMovingBlock);
        })
    }
}
Tetris.prototype.BLOCKS = {
    tree:[
        [[1,0],[1,1],[1,2],[0,1]],

    ]

}

new Tetris(document.querySelector('#root'),15,10).init();