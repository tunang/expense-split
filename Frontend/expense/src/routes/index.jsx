import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "../layout/mainLayout";
import Home from "../pages/home";
import Register from "../pages/auth/register";
import Login from "../pages/auth/login";
import DetailGroup from "../pages/group/detailGroup";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/group/:id",
        element: <DetailGroup />,
      },
    ],
  },
]);

const AppRoutes = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default AppRoutes;
