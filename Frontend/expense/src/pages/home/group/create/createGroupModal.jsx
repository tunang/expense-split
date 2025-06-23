import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Group, Plus } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { createGroupRequest } from "@/store/slices/groupSlice";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Tên nhóm không được để trống",
  }),
  description: z.string().min(1, {
    message: "Mô tả nhóm không được để trống",
  }),
  password: z.string().min(1, {
    message: "Mật khẩu không được để trống",
  }),
});

const CreateGroupModal = () => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm({
    mode: "onTouched",
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      password: "",
    },
  });

  async function onSubmit(data) {
    try {
      const { name, description, password } = data;
      console.log(name, description, password);
      dispatch(createGroupRequest({ name, description, password }));
      toast.success("Tạo nhóm thành công");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi đăng nhập");
    }
  }

  return (
    <>
      <Dialog>
        <DialogTrigger>
          <Button>
            <Plus className="w-4 h-4" />
            Tạo nhóm
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo nh</DialogTitle>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField  
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên nhóm</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên nhóm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả nhóm</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập mô tả nhóm" {...field} />
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
                          type={showPassword ? "text" : "password"}
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
              <Button type="submit" className="w-full">
                Tạo nhóm
              </Button>
            </form>
          </Form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateGroupModal;
