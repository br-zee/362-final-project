import Home from "./pages/Home/Home";
import Products from "./pages/Products/Products";
import Product from "./pages/Product/Product"
import NavBar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";
import NotFound from "./components/NotFound/NotFound";
import About from "./pages/About/About";
import Login from "./pages/Login/Login";
import Profile from "./pages/Profile/Profile";
import Admin from "./pages/Admin/Admin";
import Orders from "./pages/Orders/Orders";

import "./global.css";

import {
  createBrowserRouter,
  RouterProvider,
  Outlet
} from "react-router-dom"
import Search from "./pages/Search/Search";

import { addToCart } from "./redux/cartReducer";
import { useDispatch } from "react-redux";
import { useEffect } from "react";


const Layout = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cartItems"));
    storedCart?.forEach(item => dispatch(addToCart(item)));
  }, []);

  return (
    <div className="app">
      <NavBar/>
      <Outlet/>
      <Footer/>
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: "",
    element:<Layout/>,
    children: [
      {
        path: "",
        element: <Home/>
      },
      {
        path: ":category",
        element: <Products/>
      },
      {
        path: ":category/:id",
        element: <Product />
      },
      {
        path: ":category/:subcategory/:id",
        element: <Product/>
      },

      {
        path: "about",
        element: <About/>
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "profile",
        element: <Profile/>
      },
      {
        path: "profile/admin",
        element: <Admin/>
      },
      {
        path: "profile/orders",
        element: <Orders/>
      },
      {
        path: "search",
        element: <Search/>
      },

      // page not found or invalid product
      {
        path: "*",              
        element: <NotFound/>
      },
      {
        path: "notfound",
        element: <NotFound/>
      }
    ],
  },
])

function App() {

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App;
