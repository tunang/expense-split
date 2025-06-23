import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch } from "react-redux";
import { createExpenseRequest } from "@/store/slices/expenseSlice";

const formSchema = z.object({
  totalAmount: z.string().min(1, {
    message: "Tổng số tiền không được để trống",
  }),
  description: z.string().min(1, {
    message: "Mô tả chi tiêu không được để trống",
  }),
  expenseDate: z.string().min(1, {
    message: "Ngày chi tiêu không được để trống",
  }),
  paidById: z.string().min(1, {
    message: "Người chi tiêu không được để trống",
  }),
  groupId: z.string().min(1, {
    message: "Nhóm không được để trống",
  }),
  discountType: z.string().min(1, {
    message: "Loại chiết khấu không được để trống",
  }),
  discountValue: z.string().optional(),
  splitType: z.string().min(1, {
    message: "Loại chia tiền không được để trống",
  }),
  participants: z.array(z.string()).min(1, {
    message: "Danh sách người tham gia không được để trống",
  }),
});

const ExpenseModal = ({ groupId, members }) => {

  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [participantValues, setParticipantValues] = useState({});

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      totalAmount: "",
      description: "",
      expenseDate: "",
      paidById: "",
      groupId: groupId,
      discountType: "",
      discountValue: "",
      splitType: "",
      participants: [],
    },
  });

  const watchDiscountType = form.watch("discountType");
  const watchSplitType = form.watch("splitType");

  // Reset participant values when split type changes
  useEffect(() => {
    if (watchSplitType === "EQUAL") {
      setParticipantValues({});
    }
  }, [watchSplitType]);

  const handleParticipantToggle = (memberId) => {
    const updatedParticipants = selectedParticipants.includes(memberId)
      ? selectedParticipants.filter(id => id !== memberId)
      : [...selectedParticipants, memberId];
    
    setSelectedParticipants(updatedParticipants);
    form.setValue("participants", updatedParticipants);
    
    // Remove participant values when unselected
    if (!updatedParticipants.includes(memberId)) {
      const newValues = { ...participantValues };
      delete newValues[memberId];
      setParticipantValues(newValues);
    }
  };

  const handleParticipantValueChange = (memberId, value) => {
    setParticipantValues(prev => ({
      ...prev,
      [memberId]: parseFloat(value)
    }));
  };

  async function onSubmit(data) {
    // Prepare participants data based on split type
    const participantsData = selectedParticipants.map(participantId => {
      const baseData = { userId: participantId };
      
      if (watchSplitType === "PERCENTAGE") {
        baseData.percentage = participantValues[participantId] || 0;
      } else if (watchSplitType === "FIXED_AMOUNT") {
        baseData.fixedAmount = participantValues[participantId] || 0;
      }
      
      return baseData;
    });

    const finalData = {
      ...data,
      participants: participantsData,
      totalAmount: parseFloat(data.totalAmount),
      discountValue: data.discountValue ? parseFloat(data.discountValue) : 0,
    };

    dispatch(createExpenseRequest(finalData));
  }

  return (
    <>
      <Dialog>
        <DialogTrigger>
          <Button>
            <Plus className="w-4 h-4" />
            Thêm chi tiêu
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm chi tiêu</DialogTitle>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="totalAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tổng số tiền</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tổng số tiền" {...field} />
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
                      <FormLabel>Mô tả</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập mô tả" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expenseDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày chi tiêu</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paidById"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Người chi tiêu</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn người chi tiêu" />
                          </SelectTrigger>
                          <SelectContent>
                            {members.map((member) => (
                              <SelectItem key={member.user.id} value={member.user.id}>
                                {member.user.fullName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Participants Selection */}
                <div>
                  <FormLabel>Người tham gia</FormLabel>
                  <div className="mt-2 space-y-2 max-h-32 overflow-y-auto border rounded-md p-3">
                    {members.map((member) => (
                      <div key={member.user.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`participant-${member.user.id}`}
                          checked={selectedParticipants.includes(member.user.id)}
                          onChange={() => handleParticipantToggle(member.user.id)}
                          className="rounded"
                        />
                        <label
                          htmlFor={`participant-${member.user.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {member.user.fullName}
                        </label>
                      </div>
                    ))}
                  </div>
                  {selectedParticipants.length === 0 && (
                    <p className="text-sm text-red-500 mt-1">Danh sách người tham gia không được để trống</p>
                  )}
                </div>

                <div className="flex gap-4 ">
                  <FormField
                    control={form.control}
                    name="splitType"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Chia tiền</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn loại chia tiền" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="EQUAL">Chia đều</SelectItem>
                              <SelectItem value="PERCENTAGE">
                                Theo phần trăm
                              </SelectItem>
                              <SelectItem value="FIXED_AMOUNT">
                                Theo số tiền cố định
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="discountType"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Giảm giá</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn loại chiết khấu" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="NONE">Không có</SelectItem>
                              <SelectItem value="PERCENTAGE">
                                Theo phần trăm
                              </SelectItem>
                              <SelectItem value="FIXED_AMOUNT">
                                Theo số tiền cố định
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Discount Value Input */}
                {watchDiscountType && watchDiscountType !== "NONE" && (
                  <FormField
                    control={form.control}
                    name="discountValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Giá trị chiết khấu {watchDiscountType === "PERCENTAGE" ? "(%)" : "(VNĐ)"}
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder={watchDiscountType === "PERCENTAGE" ? "Nhập phần trăm" : "Nhập số tiền"} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Participant-specific inputs for percentage or fixed amount */}
                {(watchSplitType === "PERCENTAGE" || watchSplitType === "FIXED_AMOUNT") && selectedParticipants.length > 0 && (
                  <div>
                    <FormLabel>
                      {watchSplitType === "PERCENTAGE" ? "Phần trăm cho từng người (%)" : "Số tiền cho từng người (VNĐ)"}
                    </FormLabel>
                    <div className="space-y-3 mt-2">
                      {selectedParticipants.map((participantId) => {
                        const member = members.find(m => m.user.id === participantId);
                        return (
                          <div key={participantId} className="flex items-center gap-3">
                            <span className="text-sm font-medium min-w-[150px]">
                              {member?.user.fullName}:
                            </span>
                            <Input
                              type="number"
                              placeholder={watchSplitType === "PERCENTAGE" ? "%" : "VNĐ"}
                              value={participantValues[participantId] || ""}
                              onChange={(e) => handleParticipantValueChange(participantId, e.target.value)}
                              className="flex-1"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full">
                  Thêm
                </Button>
              </form>
            </Form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExpenseModal;
