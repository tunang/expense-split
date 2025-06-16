import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGroupsRequest } from "../../store/slices/groupSlice";
import { toast } from "sonner";
import GroupCard from "../../components/group-card";

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groups.map((group) => (
                        <GroupCard key={group.id} group={group} />
                    ))}
                </div>
            )}
        </div>
    );
}
 
export default Home;