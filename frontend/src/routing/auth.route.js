import { createRoute } from "@tanstack/react-router"
import { rootRoute } from "./routeTree"
import AuthPage from "../pages/AuthPages.jsx"

export const authRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/auth',
    component: AuthPage,
  })