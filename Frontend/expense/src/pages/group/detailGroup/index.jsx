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
  CardDescription,
  CardContent,
} from "../../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MemberModal from "./member/memberModal";
import ExpenseModal from "./expense/expenseModal";

const DetailGroup = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { group, isLoading, error } = useSelector((state) => state.detailGroup);
  const {
    members,
    isLoading: isLoadingMembers,
    error: errorMembers,
  } = useSelector((state) => state.memberGroup);

  useEffect(() => {
    dispatch(getGroupByIdRequest(id));
    dispatch(getMembersRequest(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (error || errorMembers) {
      toast.error(error || errorMembers);
    }
  }, [error, errorMembers]);

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div>
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <div className="">
          <h1 className="text-2xl font-bold">{group?.name}</h1>
          <h2 className="text-sm text-gray-500">{members.length} members</h2>
        </div>

        <div className="flex gap-2">
          {/* Member button */}
          <MemberModal members={members} />

          {/*Add Expense button */}
          <ExpenseModal />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left column */}
        <div className="col-span-4 flex flex-col gap-4">
          <Card></Card>

          <Card></Card>
        </div>

        {/* Right column */}
        <div className="col-span-8 row-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                <h2 className="text-lg font-bold">Expenses</h2>
              </CardTitle>
              <CardContent></CardContent>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DetailGroup;
