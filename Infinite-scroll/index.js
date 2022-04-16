const datas = [ 'insert your image url']
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

    setState = (nextState) =>{
        this.state = nextState;
        this.exc();
    }
    exc = () =>{
        if(this.state.loading) return;
        this.observer = new IntersectionObserver((([entry],ob) =>{
            if(entry.isIntersecting && this.state.hasMore){
                console.log('handle');
                this.state.callback();
                ob.unobserve(entry.target);
            }
        }),{threshold:0.8});
        if(this.state.element) this.observer.observe(this.state.element);
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
        <div class="item-img-container">
        <img src="${item}" />
        </div>
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
        this.$page.className ='itemListPage';
        this.loading = new Loading(this.$target,this.state.loading);
        this.infinityScroll = new InfinityScroll(null,this.state.loading,null,null);
        this.getItem();
        this.render();
    }
    setState = (nextState) =>{
        this.state = nextState;
        this.loading.setState(this.state.loading);
        this.render();
    }
    render = () =>{
        if(!this.state.items.length) return;
        this.$page.innerHTML = '';
        new ItemList(this.$page,this.state.items).render();
        this.infinityScroll.setState({
            element: this.$page.firstElementChild.lastElementChild,
            loading: this.state.loading,
            hasMore:this.state.hasMore,
            callback: this.getItem,
        })
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
