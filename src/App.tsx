import "./App.css";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Chatlayout from "./layouts/Chatlayout";
import { ThemeProvider } from "./components/providers/ThemeProvider";
import LoginPage from "./pages/LoginPage";
import ChatSessionPage from "./components/chat/ChatSessionPage";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { Toaster } from "sonner";
import StockDetailsPage from "./pages/StockDetailsPage";
import ChatNewSessionPage from "./pages/ChatNewSessionPage";
import TechnicalsPage from "./pages/TechnicalsPage";
import RegisterPage from "./pages/RegisterPage";
import ScreenerPage from "./pages/ScreenerPage";
import CompanyPage from "./pages/CompanyPage";
import ProtectedRoutes from "./components/providers/ProtectedRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Chatlayout />, // public layout
    children: [
      {
        path: "/",
        index: true,
        element: (
          <ProtectedRoutes>
            <ChatNewSessionPage />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/company",
        element: <CompanyPage />, // public page
      },
      {
        path: "/c/:id",
        element: (
          <ProtectedRoutes>
            <ChatSessionPage />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/new",
        element: (
          <ProtectedRoutes>
            <ChatNewSessionPage />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/screener/:id",
        element: (
          <ProtectedRoutes>
            <StockDetailsPage />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/technicals",
        element: (
          <ProtectedRoutes>
            <TechnicalsPage />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/screener",
        element: (
          <ProtectedRoutes>
            <ScreenerPage />
          </ProtectedRoutes>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" theme="system" />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
