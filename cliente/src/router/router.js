import { getSession, removeSession } from "../services/auth.service";
import { routes, notFoundView } from "./routes";


export function renderRouter() {
    const app = document.getElementById("app");
    const path = window.location.pathname;
    const session = getSession();

    if (session) {
        if (path === "/login" || path === "/register" || path === "/") {
            window.history.pushState({}, "", "/dashboard");
        }
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

        event.preventDefault();
        window.history.pushState({}, "", href);
        renderRouter();
    })
};

window.addEventListener("popstate", renderRouter)
renderRouter();