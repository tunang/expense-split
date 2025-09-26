import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getReceivedInvitationsRequest,
  handleInvitationRequest as handleInvitationAction,
} from "../../../store/slices/receivedInvitationSlice";

const InvitationModal = () => {
  const dispatch = useDispatch();
  const { invitations, isLoading, error } = useSelector(
    (state) => state.receivedInvitations
  );
  const [processingInvitations, setProcessingInvitations] = useState(new Set());

  useEffect(() => {
    dispatch(getReceivedInvitationsRequest());
  }, []);

  const handleInvitationRequest = async (groupId, invitationId, action) => {
    // Prevent double-click
    if (processingInvitations.has(invitationId)) {
      return;
    }

    // Add invitation to processing set
    setProcessingInvitations((prev) => new Set(prev).add(invitationId));

    try {
      dispatch(
        handleInvitationAction({
          groupId: groupId,
          requestId: invitationId,
          action: action,
        })
      );

      // Show success message
      if (action === "ACCEPT") {
        toast.success("Đã chấp nhận lời mời thành công!");
      } else {
        toast.success("Đã từ chối lời mời!");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xử lý lời mời!");
    } finally {
      // Remove invitation from processing set
      setProcessingInvitations((prev) => {
        const newSet = new Set(prev);
        newSet.delete(invitationId);
        return newSet;
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button>
          <Mail className="w-4 h-4" />
          Lời mời
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lời mời</DialogTitle>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              {invitations.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Không có lời mời nào
                </p>
              ) : (
                invitations.map((invitation) => (
                  <div
                    key={invitation.id}
                    className="flex justify-between items-center gap-2"
                  >
                    {invitation.status === "PENDING" && (
                      <div className="w-full">
                        <div className="flex flex-col gap-2 mb-3">
                          <span>Lời mời từ {invitation.sender.fullName}</span>
                          <span>Nhóm: {invitation.group.name}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="default"
                            disabled={
                              processingInvitations.has(invitation.id) ||
                              isLoading
                            }
                            onClick={() =>
                              handleInvitationRequest(
                                invitation.group.id,
                                invitation.id,
                                "ACCEPT"
                              )
                            }
                          >
                            {processingInvitations.has(invitation.id)
                              ? "Đang xử lý..."
                              : "Chấp nhận"}
                          </Button>
                          <Button
                            variant="destructive"
                            disabled={
                              processingInvitations.has(invitation.id) ||
                              isLoading
                            }
                            onClick={() =>
                              handleInvitationRequest(
                                invitation.group.id,
                                invitation.id,
                                "REJECT"
                              )
                            }
                          >
                            {processingInvitations.has(invitation.id)
                              ? "Đang xử lý..."
                              : "Từ chối"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default InvitationModal;
