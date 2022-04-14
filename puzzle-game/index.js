class Game{
    constructor($target,size){
        this.$target = $target;
        this.size = size;
        this.tiles = null;
        this.dragged = {
            el:null,
            index:null,
            class:null,
        }
    }
    init = () =>{
        const playTime = document.createElement('div');
        const startBtn = document.createElement('button');
        this.tiles = this.createTiles(this.size);
        this.tiles.forEach(li => this.$target.appendChild(li));
        
        setTimeout(()=>{
            this.$target.innerHTML = '';
            this.suffle(this.tiles).forEach(tile => this.$target.appendChild(tile));

        },2000);

        this.$target.addEventListener('dragstart', e =>{
            if(e.target.tagName !== 'LI') return;
            const object = e.target;
            this.dragged.el = object;
            this.dragged.index = [...object.parentNode.children].indexOf(object);
            this.dragged.class = object.className;
        })
        this.$target.addEventListener('dragover',e =>{
            e.preventDefault();
        })
        this.$target.addEventListener('drop', e=>{
            if(e.target.tagName !=='LI') return;
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
    }
    createTiles = (size) => {
        const width = this.$target.offsetWidth / size;
        const tiles = Array(size*size).fill().map((_,i) =>{
            const li = document.createElement('li');
            const [dy,dx] = [Math.floor(i/size), i%size];
            li.className = `li${i}`;
            li.setAttribute('data-index',i);
            li.setAttribute('draggable',true);
            li.style.width = `${width}px`;
            li.style.height = `${width}px`;
            li.style.border = `0.5px solid white`;
            li.style.background = `top -${width*dy}px left -${width*dx}px / ${this.$target.offsetWidth}px ${this.$target.offsetWidth}px url("../images/dc.jpg")`;
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
        const isMatch = [...this.$target.children].every((el,i) => el.dataset.index === i.toString() );
        // console.log(this.dragged.el.dataset);
        if(isMatch){
            console.log('match');
        }else{
            console.log('unMatch');
        }
    }
}
const init = () =>{
    const size = 5;
    const root = document.querySelector('#root');
    const container = document.createElement('ul');
    container.className = 'container';
    container.style.width = `${document.documentElement.scrollWidth * 0.7}px`;
    container.style.height = `${document.documentElement.scrollWidth * 0.7}px`;
    container.style.gridTemplateColumns = `repeat(${size},1fr)`
    root.appendChild(container);
    new Game(container,size).init();
}
init();