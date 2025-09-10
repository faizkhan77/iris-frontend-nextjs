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


const router = createBrowserRouter([
  {
    path: "/",
    Component: Chatlayout,
    children: [
      {
        path: "/c/:id",
        Component: ChatSessionPage,
      },
      {
        path: "/new",
        Component: ChatNewSessionPage,
      },
      {
        path: "/",
        index: true,
        Component: ChatNewSessionPage,
      },
      {
        path: "/screener/:id",
        Component: StockDetailsPage
      },
      // {
      //   path: "/company/stock/:key",
      //   Component: ScreenerPage
      // },
      {
        path: "/technicals",
        Component: TechnicalsPage
      },
       {
        path: "/screener",
        Component: ScreenerPage
      },
    
    ],
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/register",
    Component: RegisterPage,
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
