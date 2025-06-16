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

const MemberModal = ({ members }) => {
  console.log(members);
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
                  <TabsTrigger value="password">Invite</TabsTrigger>
                </TabsList>

                <TabsContent value="account">
                  {members.map((member) => (
                    <div key={member.id}>
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                          <p className="text-md font-medium">
                            {member.user.fullName}
                          </p>
                          <p className="text-sm text-gray-500">{member.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="password">
                  Change your password here.
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
