import { renderLogin, setupLogin } from "../views/auth/login";
import { renderNotFound } from "../views/auth/notFound";
import { renderRegister, setupRegister } from "../views/auth/register";
import { renderHome } from "../views/home";
import { renderTaskForm, setupTaskForm } from "../views/tasks/taskForm";
import { renderTasks, setupTasks } from "../views/tasks/tasks";
import { renderAdmin, setupAdmin } from "../views/users/admin";
import { renderDashboard, setupDashboard } from "../views/users/dashboard";
import { renderProfile, setupProfile } from "../views/users/profile";

export const routes = {
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
    "/task-form":{
        render: renderTaskForm,
        requiresAuth: true,
        setup: setupTaskForm
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


export const notFoundView = renderNotFound 