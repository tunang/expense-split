import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteExpenseRequest } from "@/store/slices/expenseSlice";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { User, Users, Calendar, DollarSign, Tag, Trash2 } from "lucide-react";
import getDiscountBadgeVariant from "@/utils/getDiscountBadgeVariant";
import formatCurrency from "@/utils/formatCurrency";

const ExpenseDetailDialog = ({ expense, open, onClose }) => {
  const dispatch = useDispatch();
  const handleDelete = (id) => {
    console.log(id);
    dispatch(deleteExpenseRequest(id));
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
      <DialogHeader className="space-y-3">
        <DialogTitle className="text-xl font-semibold flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Chi tiết chi phí
        </DialogTitle>
        <Separator />
      </DialogHeader>
      
      <div className="space-y-6 py-4">
        {/* Description */}
        <div className="space-y-2 flex  gap-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Tag className="h-4 w-4" />
            Mô tả: 
          </div>
          <p className="text-sm font-medium">{expense.description}</p>
        </div>

        {/* Amount Section */}
        <Card>
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Số tiền</span>
              <div className="text-right flex items-center gap-2">
                {expense.totalAmount !== expense.discountedAmount && (
                  <div className="text-sm text-muted-foreground line-through">
                    {formatCurrency(expense.totalAmount)}
                  </div>
                )}
                <div className="text-lg font-bold text-green-600">
                  {formatCurrency(expense.discountedAmount)}
                </div>
              </div>
            </div>
            
            {expense.discountType !== "NONE" && (
              <>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Giảm giá</span>
                  <Badge variant={getDiscountBadgeVariant()}>
                    {expense.discountType === "PERCENTAGE"
                      ? `${expense.discountValue}%`
                      : formatCurrency(expense.discountValue)}
                  </Badge>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Paid By */}
        <div className="space-y-2 flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mt-1">
            <User className="h-4 w-4" />
            <p>Người trả: </p>
          </div>
          <Badge variant="outline" className="font-medium">
            {expense.paidBy.fullName}
          </Badge>
        </div>

        {/* Participants & Splits */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Users className="h-4 w-4" />
            Chia cho ({expense.participants.length} người)
          </div>
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-2">
                {expense.participants.map((participant, index) => {
                  const split = expense.splits[index]
                  return (
                    <div key={participant.id} className="flex items-center justify-between py-2">
                      <span className="text-sm font-medium">
                        {participant.user?.fullName || 'Không xác định'}
                      </span>
                      <Badge variant="secondary">
                        {split ? formatCurrency(split.splitAmount) : '0 ₫'}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Date */}
        <div className="space-y-2 flex items-center gap-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mt-1.5">
            <Calendar className="h-4 w-4" />
            <p>Ngày tạo: </p>
          </div>
          <p className="text-sm">
            {format(new Date(expense.expenseDate), "EEEE, dd/MM/yyyy", {
              locale: vi,
            })}
          </p>
        </div>

        <Separator />

        {/* Delete Button */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="destructive" 
              className="w-full"
              size="lg"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa chi phí
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xóa chi phí "{expense.description}"? 
                Hành động này không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  handleDelete(expense.id)
                  onClose()
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                Xóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DialogContent>
  </Dialog>
  );
};

export const columns = [
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => {
      const description = row.original.description;
      return description || "N/A";
    },
  },
  {
    accessorKey: "paidBy",
    header: "Người trả",
    cell: ({ row }) => {
      const paidBy = row.original.paidBy.fullName;
      return paidBy;
    },
  },
  {
    id: "splitWith",
    header: "Chia cho",
    cell: ({ row }) => {
      const participants = row.original.participants;
      return participants?.map((p) => p.user?.fullName).join(", ") || "N/A";
    },
  },
  {
    accessorKey: "expenseDate",
    header: "Ngày",
    cell: ({ row }) => {
      return format(new Date(row.original.expenseDate), "dd/MM/yyyy", {
        locale: vi,
      });
    },
    sortingFn: "datetime",
  },
  {
    accessorKey: "totalAmount",
    header: "Số tiền",
    cell: ({ row }) => {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(row.original.discountedAmount);
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const expense = row.original;
      const [showDetail, setShowDetail] = useState(false);

      return (
        <>
          <Button variant="ghost" onClick={() => setShowDetail(true)}>
            Chi tiết
          </Button>
          <ExpenseDetailDialog
            expense={expense}
            open={showDetail}
            onClose={() => setShowDetail(false)}
          />
        </>
      );
    },
  },
];
