import { renderLogin, setupLogin } from "../views/auth/login";
import { renderRegister, setupRegister } from "../views/auth/register";
import { renderHome } from "../views/home";
import { renderTasks } from "../views/tasks/tasks";
import { renderAdmin } from "../views/users/admin";
import { renderDashboard } from "../views/users/dashboard";
import { renderProfile } from "../views/users/profile";

const routes = {
    "/":{
        render: renderHome
    },
    "/login":{ 
        render: renderLogin,
        requiresAuth: false,
        setup: setupLogin
    },
    "/register":{
        render: renderRegister,
        requiresAuth: false,
        setup: setupRegister
    },
    "/dashboard":{
        render: renderDashboard,
        requiresAuth: true,
        setup: setupDashboard
    },
    "/tasks":{
        render: renderTasks,
        requiresAuth: true,
        setup: setupTasks
    },
     "/profile":{
        render: renderProfile,
        requiresAuth: true,
        setup: setupProfile
    },
     "/admin":{
        render: renderAdmin,
        requiresAuth: true,
        allowedRoles: ["ADMIN"],
        setup: setupAdmin
    }
}