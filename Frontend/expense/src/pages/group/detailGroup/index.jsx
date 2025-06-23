import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGroupByIdRequest } from "../../../store/slices/detailGroupSlice";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { getMembersRequest } from "../../../store/slices/memberGroupSlice";
import { Button } from "../../../components/ui/button";
import { Plus, Users } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/ui/card";

import MemberModal from "./member/memberModal";
import ExpenseModal from "./expense/expenseModal";
import { getCreatedInvitationsRequest } from "@/store/slices/invitationSlice";
import { getExpenseRequest } from "@/store/slices/expenseSlice";
import ExpenseTab from "./table";

const DetailGroup = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { group, isLoading, error } = useSelector((state) => state.detailGroup);
  const {
    members,
    isLoading: isLoadingMembers,
    error: errorMembers,
  } = useSelector((state) => state.memberGroup);
  const { expenses, isLoading: isLoadingExpenses, error: errorExpenses } = useSelector((state) => state.expense);

  useEffect(() => {
    dispatch(getGroupByIdRequest(id));
    dispatch(getMembersRequest(id));
    dispatch(getExpenseRequest(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (error || errorMembers || errorExpenses) {
      toast.error(error || errorMembers || errorExpenses);
    }
  }, [error, errorMembers, errorExpenses]);

  const getTotalExpense = () => {
    return expenses.reduce((acc, expense) => acc + parseFloat(expense.discountedAmount), 0);
  }

  return isLoading || isLoadingMembers || isLoadingExpenses ? (
    <div>Loading...</div>
  ) : (
    <div>
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <div className="">
          <h1 className="text-2xl font-bold">{group?.name}</h1>
          <h2 className="text-sm text-gray-500">{members.length} members - {group?.id}</h2>
        </div>

        <div className="flex gap-2">
          {/* Member button */}
          <MemberModal members={members} />

          {/*Add Expense button */}
          <ExpenseModal groupId={id} members={members} />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 mt-6">
        {/* Left column */}
        <div className="col-span-4 flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>
                <h2 className="text-lg font-bold">Tổng kết</h2>
              </CardTitle>

            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <h3>Tổng chi tiêu</h3>
                <h3>{getTotalExpense().toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</h3>
              </div>
            </CardContent>
          </Card>

          <Card></Card>
        </div>

        {/* Right column */}
        <div className="col-span-8 row-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                <h2 className="text-lg font-bold">Chi phí</h2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ExpenseTab />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DetailGroup;
