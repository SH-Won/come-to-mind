class Tetris{
    constructor($target,ROW,COL){
        this.$target = $target;
        this.ROW = ROW , this.COL = COL;
        this.playGround = document.createElement('div');
        this.movingBlock = null;
        this.tempMovingBlock = null;
        this.interval = null;
    }
    init = () =>{
        this.$target.appendChild(this.playGround);
        this.playGround.className= 'playGround';
        this.playGround.style.width = `${this.$target.offsetWidth*0.5}px`;
        const {playGround,ROW} = this;

        for(let i=0; i<ROW; i++){
            playGround.prepend( this.prependLine());
        }
        this.event();
        this.createBlock();
    }
    prependLine = () =>{
        const {COL} = this;
        const height = this.$target.offsetWidth*0.5 / this.COL;
        const row = document.createElement('li');
        row.style.height = `${height}px`;
        const ul = document.createElement('ul');
        for(let i=0; i<COL; i++){
            const li = document.createElement('li');
            ul.appendChild(li);
        }
        row.prepend(ul);
        return row;
    }
    renderBlock = (moveType=null) =>{
        const {type,direction,top,left} = this.tempMovingBlock;
        const currentBlock = document.querySelectorAll('.moving');
        currentBlock.forEach(block => block.classList.remove(type,'moving'))
        this.BLOCKS[type][direction].some(([y,x])=>{
            const [ny,nx] = [y+top,x+left];
            const target = this.playGround.childNodes[ny] ? this.playGround.childNodes[ny].children[0].childNodes[nx] : null;
            if(!target || target.classList.contains('seize')){
                this.tempMovingBlock = {...this.movingBlock};
                setTimeout(()=>{
                    this.renderBlock('re');
                    if(moveType ==='top'){
                        this.seizeBlock();
                    }
                },0)
                return true;
            }else{
                this.playGround.childNodes[ny].children[0].childNodes[nx].classList.add(type,'moving');
            }
        })
        this.movingBlock = {...this.tempMovingBlock};
    }
    seizeBlock = () =>{
        const currentBlock = document.querySelectorAll('.moving');
        currentBlock.forEach(block => (block.classList.remove('moving'), block.classList.add('seize')))
        this.checkLine();
    }
    checkLine = () =>{
        const {type,direction,top} = this.movingBlock;
        const rowPos = Array.from(new Set(this.BLOCKS[type][direction].map(([y,x]) => y+top))).sort((a,b) => a-b);
        // console.log(rowPos)
        // console.log(this.playGround.childNodes[14].children[0].childNodes);
        rowPos.forEach(y =>{
            if([...this.playGround.childNodes[y].children[0].childNodes].every(child => child.classList.contains('seize'))){
                this.playGround.childNodes[y].remove();
                this.playGround.prepend(this.prependLine());
            }
        })
        this.createBlock();
    }
    createBlock = () =>{
        clearInterval(this.interval);
        this.interval = setInterval(()=>{
            this.moveBlock('top',1);
        },500)
        const blockArr = Object.keys(this.BLOCKS);
        const index = Math.floor(Math.random()*blockArr.length);
        this.movingBlock = {
            type:blockArr[index],
            top:0,
            left:4,
            direction:0
        };
        this.tempMovingBlock = {...this.movingBlock};
        this.renderBlock();
    }
    moveBlock = (moveType,amount) =>{
        this.tempMovingBlock[moveType] += amount;
        this.renderBlock(moveType);
    }
    rotateBlock = () =>{
        const {type,direction} = this.tempMovingBlock;
        this.tempMovingBlock.direction = direction + 1 >= this.BLOCKS[type].length ? 0 : direction + 1;
        this.renderBlock();
    }
    dropBlock = () =>{
        clearInterval(this.interval);
        this.interval = setInterval(() =>{
             this.moveBlock('top',1);
        },10)
    }
    event = () =>{
        document.addEventListener('keydown',e =>{
            console.log(e.keyCode);
            switch(e.keyCode){
                case 37 : return this.moveBlock('left',-1);
                case 39 : return this.moveBlock('left',1);
                case 40 : return this.moveBlock('top',1);
                case 38 : return this.rotateBlock();
                case 32 : return this.dropBlock();
                default : break;
            }
        })
    }
}
Tetris.prototype.BLOCKS = {
    tree:[
        [[1,0],[1,1],[1,2],[0,1]],
        [[0,1],[1,1],[1,2],[2,1]],
        [[1,1],[1,2],[1,0],[2,1]],
        [[0,1],[1,1],[1,0],[2,1]]
    ],
    square:[
        [[0,0],[0,1],[1,0],[1,1]]
    ],
    z:[
        [[0,0],[0,1],[1,1],[1,2]],
        [[0,1],[1,1],[1,0],[2,0]],
    ],
    line:[
        [[0,0],[0,1],[0,2],[0,3]],
        [[0,1],[1,1],[2,1],[3,1]]
    ],
    rightL:[
        [[0,0],[1,0],[2,0],[2,1]],
        [[2,0],[1,0],[1,1],[1,2]],
        [[1,0],[1,1],[2,1],[3,1]],
        [[1,1],[2,1],[2,0],[2,-1]]
    ],
    leftL:[
        [[0,1],[1,1],[2,1],[2,0]],
        [[1,0],[2,0],[2,1],[2,2]],
        [[1,0],[2,0],[3,0],[1,1]],
        [[1,1],[1,0],[1,-1],[2,1]]
    ]

}

new Tetris(document.querySelector('#root'),15,10).init();