class Game{
    constructor($target,size){
        this.$target = $target;
        this.size = size;
        this.tiles = null;
        this.dragged = {
            index:null,
            class:null,
        }
    }
    init = () =>{
        const playTime = document.createElement('div');
        const startBtn = document.createElement('button');
        this.tiles = this.createTiles(this.size);
        console.log(this.tiles);
        this.tiles.forEach(li => this.$target.appendChild(li))
        const div = document.createElement('div');
        // div.addEventListener('dragstart')
        this.$target.addEventListener('dragstart', e =>{
            if(e.target.tagName !== 'LI') return;
            const object = e.target;
        })
    }
    createTiles = (size) => {
        console.log(window.screenX);
        console.dir(this.$target)
        const width = this.$target.offsetWidth / size;
        console.log(width);
        const tiles = Array(size*size).fill().map((_,i) =>{
            const li = document.createElement('li');
            const img = document.createElement('img');
            img.src = '../images/dc.jpg';
            const [dy,dx] = [Math.floor(i/size), i%size];
            img.style.top = `-${width*dy}px`;
            img.style.left = `-${width*dx}px`;
            img.style.width = `${100*size}%`;
            img.style.height = `${100*size}%`;
            li.appendChild(img);
            li.className = `li${i}`;
            li.setAttribute('data-index',i);
            li.style.width = `${width}px`;
            li.style.height = `${width}px`;
            li.style.border = `0.5px solid white`;
            return li;
        });
        // tiles.forEach((tile,i)=>{
        //     
        //     tile.style.backgroundPositionY =`-${width*dy}px`
        //     tile.style.backgroundPositionX =`-${width*dx}px`
        // })
        return tiles;
    }
    suffle = (tiles) =>{

    }
}
const init = () =>{
    const size = 5;
    const root = document.querySelector('#root');
    const container = document.createElement('ul');
    container.className = 'container';
    container.style.width = `${document.documentElement.scrollWidth * 0.7}px`
    container.style.gridTemplateColumns = `repeat(${size},1fr)`
    root.appendChild(container);
    new Game(container,size).init();
}
init();