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
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { createJoinRequest } from "@/store/slices/joinRequestSlice";
import { toast } from "sonner";

const formSchema = z.object({
  groupId: z.string().min(1, {
    message: "Mã nhóm không được để trống",
  }),
  password: z.string().min(1, {
    message: "Mật khẩu nhóm không được để trống",
  }),
});

const JoinGroupModal = () => {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.joinRequest);
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm({
    mode: "onTouched",
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupId: "",
      password: "",
    },
  });

  async function onSubmit(data) {
    try {
      console.log(data);
      const { groupId, password } = data;
      console.log(groupId, password);
      dispatch(createJoinRequest({ groupId, password }));
    } catch (error) {
      toast.error(error.message || "Có lỗi xảy ra khi tham gia nhóm");
    }
  }

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <Dialog>
      <DialogTrigger>
        <Button>
          <Group className="w-4 h-4" />
          Tham gia
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tham gia nhóm</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="groupId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã nhóm</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập mã nhóm" {...field} />
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
              Tham gia nhóm
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinGroupModal;
