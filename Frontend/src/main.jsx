
import { createRoot } from "react-dom/client";
import "./index.css";
import {createBrowserRouter, Outlet, RouterProvider} from 'react-router-dom'
import Header from "./pages/Header.jsx";
import Footer from "./pages/Footer.jsx";
import Home from "./pages/Home.jsx"
import Character from "./pages/Character.jsx"
import Profile from "./pages/Profile.jsx"
import Match from "./pages/Match.jsx"
import Connections from "./pages/Connections.jsx";

const Layout = () => {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/character",
        element: <Character />,
      },
      {
        path: "/match",
        element: <Match/>,
      },
      {
        path:"/profile",
        element:<Profile/>
      },
      {
        path:"/connections",
        element:<Connections/>
      }
    ],
  },
]);

createRoot(document.getElementById("root")).render(
 <RouterProvider router={router}/>
);
