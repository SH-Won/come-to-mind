const datas =[
   ' insert your image url'
]
class InfinityScroll{
    constructor(element,loading,hasMore,callback){
        this.state = {
            element,
            loading,
            hasMore,
            callback,
        }
        this.observer = null;
    }
    handleScorll = (([entry],ob) =>{
        if(entry.isIntersecting && this.hasMore){
            console.log('handle');
            this.callback();
            ob.unobserve(entry.target);
        }
    })
    setState = (nextState) =>{
        this.state = nextState;
        console.log(this.state);
        this.exc();
    }
    exc = () =>{
        if(this.loading) return;
        this.observer = new IntersectionObserver(this.handleScorll,{threshold:0.9});
        if(this.element) this.observer.observe(this.element);
        console.log(this.element);
    }
}
class Loading{
    constructor($target,loading){
        this.$target = $target;
        this.$component = document.createElement('div');
        this.loading = loading;
        this.$component.className= 'loadingComponent';
        this.$component.innerHTML = '<div class="loadingItem"></div>'.repeat(4);
    }
    setState = (nextState) =>{
        this.loading = nextState;
        this.render();
    }
    render = () =>{
        if(!this.loading){
            this.$target.removeChild(this.$component);
            return;
        }
        this.$target.appendChild(this.$component);
    }
}
class ItemList{
    constructor($target,initialState){
        this.$target = $target,
        this.items = initialState;
        this.$List = document.createElement('div');
        this.$target.appendChild(this.$List);
    }
    setState = (nextState) =>{
        this.state = nextState;
        this.render();
    }
    render = () =>{
        if(!this.items) return;
        this.$List.className = 'itemList';
        this.$List.innerHTML = `
        ${this.items.map(item => `
        <div class="item">
        <img src="${item}" />
        </div>
        `).join('')}
        `
    }
}
class ItemListPage{
    constructor($target){
        this.$target = $target;
        this.$page = document.createElement('div');
        this.state = {
            items:[],
            loading:true,
            skip:0,
            limit:4,
            hasMore:true,
        }
        this.loading = null;
        this.infinityScroll = null;
        this.$target.appendChild(this.$page);
    }
    init = () =>{
        this.$page.className ='ItemListPage';
        this.loading = new Loading(this.$target,this.state.loading);
        this.infinityScroll = new InfinityScroll(null,this.state.loading,null,null);
        this.getItem();
        this.render();
    }
    setState = (nextState) =>{
        this.state = nextState;
        console.log(this.state);
        this.loading.setState(this.state.loading);
        // console.log(this.$page.lastElementChild)
    
        this.render();
    }
    render = () =>{
        if(!this.state.items.length) return;
        this.$page.innerHTML = '';
        new ItemList(this.$page,this.state.items).render();
        console.log(this.$page.firstElementChild.lastElementChild);
        this.infinityScroll.setState({
            element: this.$page.firstElementChild.lastElementChild,
            loading: this.state.loading,
            hasMore:this.state.hasMore,
            callback: this.getItem,
        })
        console.log(this.infinityScroll.state)
    }
    getItem = async () =>{
        try{
            this.setState({
                ...this.state,
                loading:true,
            })
            const {skip,limit}  = this.state;
            const items = await new Promise((res,rej) =>{
            // to make delay-time to get datas in real web , by using Promise;
            setTimeout(()=>{
                const data = datas.slice(skip,skip+limit);
                res(data);
            },400)
            }).then(result => this.setState({
                ...this.state,
                skip:skip+limit,
                items:[...this.state.items,...result],
                hasMore : result.length < limit ?  false : true,
               }))
             .catch(err => console.log(err));
        }catch(e){

        }finally{
            this.setState({
                ...this.state,
                loading:false,
            })
        }
    }
}
class App{
    constructor($target){
        this.$target = $target;
    }
    init = () =>{
        new ItemListPage(this.$target).init();
    }
    render = () =>{

    }
}
new App(document.querySelector('#root')).init();

