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
import ScreenerDetailspage from "./pages/ScreenerDetailspage";
import DummydataCheck from "./pages/DummydataCheck";
import CompanyPage from "./pages/CompanySearchPage";
import ProtectedRoutes from "./components/providers/ProtectedRoutes";
import PersistLogin from "./components/providers/PersistLogin";
import ScreenerIndexPage from "./components/screener/ScreenerDashboard";
import ChatShareSessionPage from "./pages/ChatShareSessionPage";
import NewsPage from "./pages/NewsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PersistLogin>
        <Chatlayout />
      </PersistLogin>
    ), // public layout
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
        path: "/company/:id",
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
        children: [
          {
            index: true,
            element: <ScreenerIndexPage />,
          },
          {
            path: "stratagy/:name",
            element: <ScreenerDetailspage />,
          },
        ],
      },
      {
        path: "/dummycheck",
        Component: DummydataCheck,
      },
      {
        path: "/screener/:id",
        element: <ScreenerDetailspage />,
      },
      {
        path: "/news",
        element: <NewsPage />,
      },
    ],
  },
  {
    path: "/share/:message_id",
    element: <ChatShareSessionPage />,
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
