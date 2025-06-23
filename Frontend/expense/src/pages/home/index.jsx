import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGroupsRequest } from "../../store/slices/groupSlice";
import { toast } from "sonner";
import GroupCard from "../../components/group-card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Group, Plus } from "lucide-react";
import CreateGroupModal from "./group/create/createGroupModal";
import JoinGroupModal from "./group/join/joinGroupModal";
import InvitationModal from "./invitation/InvitationModal";

const Home = () => {
  const dispatch = useDispatch();
  const { groups, isLoading, error } = useSelector((state) => state.group);

  useEffect(() => {
    dispatch(getGroupsRequest());
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="home">
      {isLoading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div>
          <div className="flex justify-between gap-4">
            <CreateGroupModal />
            <div className="flex gap-4">
              <JoinGroupModal />
              <InvitationModal />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {groups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
