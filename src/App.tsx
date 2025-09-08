import "./App.css";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Chatlayout from "./layouts/Chatlayout";
import { ThemeProvider } from "./components/providers/ThemeProvider";
import LoginPage from "./pages/LoginPage";
import ChatSessionPage from "./components/chat/ChatSessionPage";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Chatlayout,
    children : [
      {
        path :"/:id",
        Component : ChatSessionPage
      },
      {
        path :"/new",
        index : true,
        element : <div>Hello</div>
      },
      {
        path :"/screener",
        element : <div>Screener</div>,
        children : [
          {
            path : "/indicators",
            element : <div>Indicators</div>
          },
          {
            path : "/",
            element : <div>Single Screenner</div>
          },
        ]
      },
      {
        path :"/company",
        children : [
          {
            path : "/:symbol"
          }
        ]
      },
    ]
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/register",
    Component: Chatlayout,
  },
]);

const App = () => {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
