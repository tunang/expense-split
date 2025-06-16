import { Button } from "@/components/ui/button";
import { Outlet } from "react-router-dom";
import ScrollToTop from "../../components/ScrollToTop";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  User,
  User2,
  Package,
  LogIn,
  UserPlus,
  LogOut,
  Lock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import logo from "../../assets/images/logo.png";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { logoutRequest } from "../../store/slices/authSlice";
const MainLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
    const handleLogin = () => {
        navigate("/login");
    };
    const handleRegister = () => {
        navigate("/register");
    };
  return (
    <div>
      <ScrollToTop />
      <nav className="flex h-20 items-center justify-between px-6 py-2 shadow-md bg-white">
        {/* Logo */}
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src={logo}
            alt="logo"
            className="w-16 h-16 hover:scale-105 transition-transform"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* User Authentication */}
          {!isAuthenticated && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="w-6 h-6" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 mt-2">
                <div className="flex flex-col gap-2">
                  <Link to="/login">
                    <Button
                      onClick={handleLogin}
                      className="w-full justify-start"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button
                      onClick={handleRegister}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Đăng ký
                    </Button>
                  </Link>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {isAuthenticated && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <User className="w-6 h-6" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 mt-2">
                <div className="flex flex-col gap-2">
                  <div className="px-3 py-2 border-b">
                    <p className="font-medium text-sm">Xin chào,</p>
                    <p className="text-sm text-gray-600 truncate">
                      {user?.name}
                    </p>
                  </div>
                  <Link to="/profile">
                    <Button variant="ghost" className="w-full justify-start">
                      <User2 className="w-4 h-4 mr-2" />
                      Tài khoản của tôi
                    </Button>
                  </Link>


                  <div className="border-t pt-2">
                    <Button
                      onClick={() => dispatch(logoutRequest())}
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Đăng xuất
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="mx-4 md:mx-8 lg:mx-16 mt-4">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
