import { createBrowserRouter } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/login/login";
import Dashboard from "./layouts/Dashboard";
import NonAuth from "./layouts/NonAuth";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Dashboard />,
        children: [
            {
                path: "",
                element: <HomePage />
            },
        ]
    },
    {
        path: '/auth',
        element: <NonAuth />,
        children: [
            {
                path: "login",
                element: <LoginPage />
            }
        ]
    },

])