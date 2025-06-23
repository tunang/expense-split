import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { Input } from "@/components/ui/input"
import { useDispatch, useSelector } from "react-redux";
import { getCreatedInvitationsRequest } from "@/store/slices/invitationSlice";
import { use, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJoinRequest, handleJoinRequest } from "@/store/slices/joinRequestSlice";
import { inviteUserRequest } from "../../../../store/slices/invitationSlice";
import { toast } from "sonner";

const MemberModal = ({ members }) => {
  const dispatch = useDispatch();

  const [userId, setUserId] = useState("");

  const { id } = useParams();
  const { invitations, isLoading: invitationLoading, error: invitationError } = useSelector((state) => state.invitation);
  const { joinRequest, isLoading: joinRequestLoading, error: joinRequestError } = useSelector((state) => state.joinRequest);

  useEffect(() => {
    dispatch(getCreatedInvitationsRequest(id));
    dispatch(getJoinRequest(id));
  }, [dispatch, id]);

  useEffect(() => {
    if(invitationError){
      toast.error(invitationError || "Invitation error occurred");
    }
  }, [invitationError]);
  
  useEffect(() => {
    if(joinRequestError){
      toast.error(joinRequestError || "Join request error occurred");
    }
  }, [joinRequestError]);


  const clickJoinRequest = (requestId, actionType) => {
    dispatch(handleJoinRequest({requestId, actionType, groupId: id}));
  }

  const clickInvite = (userId) => {
    dispatch(inviteUserRequest({userId, groupId: id}));
  }

  return (
    <>
      <Dialog>
        <DialogTrigger>
          <Button>
            <Users className="w-4 h-4" />
            Member
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Members</DialogTitle>
            <DialogDescription>
              <Tabs defaultValue="account" className="w-[400px]">
                <TabsList>
                  <TabsTrigger value="account">Members</TabsTrigger>
                  <TabsTrigger value="invite">Invite</TabsTrigger>
                </TabsList>

                <TabsContent value="account">
                  {members.map((member) => (
                    <div key={member.id}>
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                          <span className="text-md font-medium">
                            {member.user.fullName}
                          </span>
                          <span className="text-sm text-gray-500">{member.role}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="invite">
                  <div className="flex gap-2 w-full">
                    <Input onChange={(e) => setUserId(e.target.value)} type="text" placeholder="User ID" className="basis-3/4" />
                    <Button onClick={() => clickInvite(userId)} className="basis-1/4 ml-2">Invite</Button>
                  </div>

                  <div className="mt-4">
                    <div className="text-lg font-medium">Invitations</div>
                    {invitationLoading ? <div>Loading...</div> : invitations?.map((invitation) => (
                      <div className="flex items-center gap-2" key={invitation.id}>
                        <p>{invitation.invitedUser.fullName}</p>
                        <p>{invitation.status}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8">
                    <h2 className="text-lg font-medium">Join request</h2>
                    {joinRequest.map((request) => {
                      if(request.status === "PENDING"){
                        return (
                          <div key={request.id}>
                            <p>{request.user.fullName}</p>
                            <p>{request.status}</p>
                            <Button className="bg-green-500 text-white" onClick={() => clickJoinRequest(request.id, "ACCEPT")}>Accept</Button>
                            <Button className="bg-red-500 text-white" onClick={() => clickJoinRequest(request.id, "DECLINE")}>Reject</Button>
                          </div>
                        )
                      }
                    })}
                  </div>
                </TabsContent>
              </Tabs>
              
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MemberModal;
