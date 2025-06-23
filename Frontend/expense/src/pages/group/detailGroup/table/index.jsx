import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useSelector } from "react-redux";

const ExpenseTab = () => {
    const { expenses: data, isLoading, error } = useSelector((state) => state.expense);
    console.log(data);
    return ( 
        <div>
            <DataTable columns={columns} data={data} />
        </div>
     );
}
 
export default ExpenseTab;