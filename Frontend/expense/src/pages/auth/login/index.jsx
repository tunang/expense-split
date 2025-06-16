import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { loginRequest } from "../../../store/slices/authSlice";

const formSchema = z.object({
  username: z.string().min(1, {
    message: "Tên tài khoản không được để trống",
  }),
  password: z.string().min(1, {
    message: "Mật khẩu không được để trống",
  }),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {isLoading, isAuthenticated, error} = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    mode: "onTouched",
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  async function onSubmit(data) {
    try {
      const { username, password } = data;
      console.log(username, password);
      dispatch(loginRequest({ username, password }));
      toast.success('Đăng nhập thành công');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đăng nhập');
    }
  }

  return (
    <>
      <div className="flex h-screen w-screen justify-center">
        <Card className="absolute w-96 mt-20">
          <CardHeader className="flex items-center">
            <CardTitle>Đăng nhập</CardTitle>
          </CardHeader>
          <CardContent className="">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên tài khoản</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên tài khoản" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? 'text' : 'password'} 
                            placeholder="Nhập mật khẩu" 
                            {...field} 
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-500" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full"
                >
                  {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </Button>

                <Link to="/register" className="w-full block text-center text-blue-600 hover:underline">
                  Chưa có tài khoản? Đăng ký
                </Link>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="justify-center">
            {/* <CardDescription>Copyright 2024 © HaUI</CardDescription> */}
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Login;
