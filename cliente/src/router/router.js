import { getSession } from "../services/auth.service";
import { routes, notFoundView } from "./routes";


export function renderRouter() {
    const app = document.getElementById("app");
    const path = window.location.pathname;
    const session = getSession();

    if (session) {
        if (path === "/login" || path === "/register" || path === "/") {
            window.history.replaceState({}, "", "/dashboard");
        }
    }
    
    if (path === "/profile" && sessionStorage.getItem("blockProfile")) {
        window.history.replaceState(null, "", "/dashboard");
        app.innerHTML = routes["/dashboard"].render();
        if (routes["/dashboard"].setup) routes["/dashboard"].setup();
        return;
    }

    if (!session) {
        if (path !== "/login" && path !== "/register" && path !== "/") {
            window.history.replaceState({}, "", "/login");
        }
    }

    if (!app) {
        return;
    }

    const currentPath = window.location.pathname;

    const route = routes[currentPath] ?? { render: notFoundView };
    app.innerHTML = route.render();

    if (route.setup) {
        route.setup();
    }

    if (path === "/profile" && sessionStorage.getItem("blockProfile")) {
        window.history.replaceState(null, "", "/dashboard");
    }
}


export function initRouter() {
    document.addEventListener("click", (event) => {
        const link = event.target.closest("a");
        if (!link) {
            return;
        }

        const href = link.getAttribute("href");
        if (!href || !href.startsWith("/")) {
            return;
        }

        if (href === "/profile") {
            sessionStorage.removeItem("blockProfile");
        }

        event.preventDefault();
        window.history.pushState({}, "", href);
        renderRouter();
    })
};

window.addEventListener("popstate", renderRouter)
renderRouter();