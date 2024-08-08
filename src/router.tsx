import { createBrowserRouter } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/login/login";
import Dashboard from "./layouts/Dashboard";
import NonAuth from "./layouts/NonAuth";
import Root from "./layouts/Root";
import Users from "./Pages/users/Users";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
            {
                path: '',
                element: <Dashboard />,
                children: [
                    {
                        path: "",
                        element: <HomePage />
                    },
                    {
                        path: "users",
                        element: <Users />
                    },
                ]
            },
            {
                path: 'auth',
                element: <NonAuth />,
                children: [
                    {
                        path: "login",
                        element: <LoginPage />
                    }
                ]
            },
        ]
    },
])