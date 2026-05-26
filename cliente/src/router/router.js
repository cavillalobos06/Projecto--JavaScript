import { routes , notFoundView} from "./routes";


export function renderRouter(){
    const app = document.getElementById("app");

    if(!app){
        return;
    }

    const currentPath = window.location.pathname;

    const route = routes[currentPath] ?? {render : notFoundView};
    app.innerHTML = route.render();

    if(route.setup){
        route.setup();
    }
}


export function initRouter(){
    return;
}