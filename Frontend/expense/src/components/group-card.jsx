import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { CardFooter } from "@/components/ui/card";
import { modifyDate } from "../lib/utils";
import { useNavigate } from "react-router-dom";
const GroupCard = ({ group }) => {
  const navigate = useNavigate();


  const handleClick = () => {
    navigate(`/group/${group.id}`);
  };
  
  return (
    <Card
      className="group-card hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={handleClick}
    >
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{group.name}</CardTitle>
        <CardDescription className="text-sm text-gray-500">
          {group.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">
          Created at: {modifyDate(group.createdAt)}
        </p>
        <p className="text-sm text-gray-500">
          Updated at: {modifyDate(group.updatedAt)}
        </p>
      </CardContent>
    </Card>
  );
};

export default GroupCard;
