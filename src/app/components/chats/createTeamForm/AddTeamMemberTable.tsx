import { Checkbox } from "@/app/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";

import { Dispatch, SetStateAction, useState } from "react";
import { EmployeeData } from "./CreateTeamForm";
import { ScrollArea, ScrollBar } from "@/app/components/ui/scroll-area";

export default function AddTeamMemberTable({ data, teamId }: { data: EmployeeData[], teamId: string }) {
    // State for add employees table component
    const [checkedEmployeesId, setCheckedEmployeesId] = useState<string[]>([]);
    const [allChecked, setAllChecked] = useState<boolean>(false);

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead><Checkbox checked={allChecked} onCheckedChange={(checked => {
                        if (!checked) {
                            setAllChecked(true);
                            return setCheckedEmployeesId(data.map(ele => ele.id))
                        };

                        setAllChecked(false);
                        return setCheckedEmployeesId([]);
                    })} /></TableHead>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>Role</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map(ele => (
                    <TableRow key={ele.id}>
                        <TableCell>
                            <Checkbox checked={checkedEmployeesId.some(employeeId => employeeId === ele.id)} onCheckedChange={(checked => {
                                if (!checked) return setCheckedEmployeesId(prevState => [...prevState, ele.id]);

                                return setCheckedEmployeesId(prevState => prevState.filter(state => state !== ele.id))
                            })} />
                        </TableCell>
                        <TableCell>{ele.employeeId}</TableCell>
                        <TableCell>{ele.name}</TableCell>
                        <TableCell>{ele.designation}</TableCell>
                        <TableCell>{ele.role}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}