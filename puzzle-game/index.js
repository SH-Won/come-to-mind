class Game{
    constructor($target,size){
        this.$target = $target;
        this.size = size;
        this.tiles = null;
        this.container = null;
        this.isPlaying = false;
        this.time = 0;
        this.timeInterval = null;
        this.gameText = document.createElement('span');
        this.playTime = document.createElement('div');
        this.startBtn = document.createElement('button');
        this.initialPlay = false;
        this.dragged = {
            el:null,
            index:null,
            class:null,
        }
    }
    init = () =>{
        const containerSize = document.documentElement.scrollWidth * 0.7
        if(!this.initialPlay){
        const container = document.createElement('ul');
        container.className = 'container';
        container.style.width = `${containerSize}px`;
        container.style.height = `${containerSize}px`;
        container.style.gridTemplateColumns = `repeat(${this.size},1fr)`
        this.container = container;
        this.gameText.className = 'gameText';
        this.playTime.className = 'playTime';
        this.startBtn.className = 'startBtn';
        this.startBtn.innerText = 'START';
        this.gameText.innerText = 'SUCCESS PUZZLE'
        this.gameText.style.display = 'none';
        this.$target.appendChild(this.playTime);
        this.$target.appendChild(this.container);
        this.$target.appendChild(this.startBtn);
        this.$target.appendChild(this.gameText);
        this.tiles = this.createTiles(containerSize , this.size);
        this.playTime.innerText = this.time;
        }
        else{
            this.tiles.sort((a,b) => parseInt(a.dataset.index) - parseInt(b.dataset.index));
            this.playTime.innerText = this.time;
        }
        this.container.innerHTML = '';
        this.tiles.forEach(tile => this.container.appendChild(tile));

        this.$target.addEventListener('dragstart', e =>{
            if(e.target.tagName !== 'LI' || !this.isPlaying) return;
            const object = e.target;
            this.dragged.el = object;
            this.dragged.index = [...object.parentNode.children].indexOf(object);
            this.dragged.class = object.className;
        })
        this.$target.addEventListener('dragover',e =>{
            e.preventDefault();
        })
        this.$target.addEventListener('drop', e=>{
            if(e.target.tagName !=='LI' || !this.isPlaying) return;
            const object = e.target;
            if(object.className !== this.dragged.class){
                let originPlace , isLast ;
                if(this.dragged.el.nextSibling){
                    originPlace = this.dragged.el.nextSibling;
                    isLast = false;
                }else{
                    originPlace = this.dragged.el.previousSibling;
                    isLast = true;
                }
                const dropIndex = [...object.parentNode.children].indexOf(object);
                this.dragged.index > dropIndex ? object.before(this.dragged.el) : object.after(this.dragged.el);
                isLast ? originPlace.after(object) : originPlace.before(object);
            }
            this.checkStatus();
        })
        this.$target.addEventListener('click',e =>{
            if(e.target.className !== 'startBtn' || this.isPlaying) return;
            this.start();
        })
    }
    start = () =>{
        this.gameText.style.display = 'none';
        setTimeout(()=>{
            // clearInterval(timeInterval);
            this.suffle(this.tiles).forEach(tile => this.container.appendChild(tile));
            this.isPlaying = true;
            this.timeInterval = setInterval(()=>{
                 this.time++;
                 this.playTime.innerText = this.time;
            },1000)

        },2000);
    }
    createTiles = (containerSize,tileSize) => {
        const width = containerSize / tileSize;
        const tiles = Array(tileSize*tileSize).fill().map((_,i) =>{
            const li = document.createElement('li');
            const [dy,dx] = [Math.floor(i/tileSize), i%tileSize];
            li.className = `li${i}`;
            li.setAttribute('data-index',i);
            li.setAttribute('draggable',true);
            li.style.width = `${width}px`;
            li.style.height = `${width}px`;
            li.style.border = `0.5px solid white`;
            li.style.background = `top -${width*dy}px left -${width*dx}px / ${containerSize}px ${containerSize}px url("insert your image url")`;
            return li;
        });
        return tiles;
    }
    suffle = (tiles) =>{
        let i = tiles.length - 1;
        while(i > 0){
            const random = Math.floor(Math.random() * (i+1));
            [tiles[i],tiles[random]] = [tiles[random],tiles[i]];
            i--; 
        }
        return tiles;
    }
    checkStatus = () =>{
        const isMatch = [...document.querySelector('.container').children].every((el,i) => el.dataset.index === i.toString() );
        if(isMatch){
            clearInterval(this.timeInterval);
            this.time = 0;
            this.isPlaying = false;
            this.initialPlay = true;
            this.playTime.innerText = this.time;
            this.gameText.style.display = 'block';
        }else{
            
        }
    }
}
const init = () =>{
    const size = 5; // you can choose puzzle matrix size (ex. size * size matrix);
    const root = document.querySelector('#root');
    new Game(root,size).init();
}
init();