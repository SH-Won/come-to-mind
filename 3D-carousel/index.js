
function Carousel(target,imageData){
    const carousel = document.createElement('div');
    this.el = carousel;
    carousel.className = 'carousel';

    this.render = () => {
        target.appendChild(carousel);
        carousel.innerHTML = `
        ${imageData.map(image => `
        <div class="panel">
        <img src="${image}"/>
        </div>
        `).join('')}
        `
        const angle = 360 / imageData.length;
        const calcZ = carousel.scrollWidth * Math.sqrt(3) / 2 + 30;
        for(let i=0; i<carousel.children.length; i++){
            carousel.children[i].style.transform = 'rotateY'+'('+`${i*angle}deg`+')'+' '+'translateZ'+'('+`${calcZ}px`+')';
        }
    }
    
    this.render();

}
const init = () =>{
    const root = document.querySelector('#root');
    const imageData = [
        'insert your image'
    ]
    const carousel = new Carousel(root,imageData);
    const prevBtn = document.createElement('button');
    const nextBtn = document.createElement('button');
    prevBtn.className = 'btn prev';
    nextBtn.className = 'btn next';
    root.appendChild(prevBtn);
    root.appendChild(nextBtn);
    const angle = 360 / carousel.el.children.length;
    let i = 0;
    prevBtn.addEventListener('click',()=>{
        carousel.el.style.transform = `rotateY(${++i*angle}deg)`;
    })
    nextBtn.addEventListener('click',()=>{
        carousel.el.style.transform =  `rotateY(${--i*angle}deg)`;
    })

}
init();