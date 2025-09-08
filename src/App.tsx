import "./App.css";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Chatlayout from "./layouts/Chatlayout";
import { ThemeProvider } from "./components/providers/ThemeProvider";
import LoginPage from "./pages/LoginPage";
import ChatSessionPage from "./components/chat/ChatSessionPage";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { Toaster } from 'sonner';

const router = createBrowserRouter([
  {
    path: "/",
    Component: Chatlayout,
    children: [
      {
        path: "/:id",
        Component: ChatSessionPage,
      },
      {
        path: "/new",
        index: true,
        element: <div>Hello</div>,
      },
    ],
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
    <Provider store={store}>
      <ThemeProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right"theme="system" />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
