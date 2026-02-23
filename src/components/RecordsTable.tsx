import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from '@mui/x-data-grid';
import { Box, Typography, Paper } from "@mui/material";
import { useEmployees } from "../context/EmployeesContext";
import { format, parse } from "date-fns";
import { useMemo } from "react";

const RecordsTable = () => {
    const { fileName, records } = useEmployees();

    const columns = useMemo<GridColDef[]>(
        () => [
            { field: "empId", headerName: "Employee ID", flex: 1 },
            { field: "projectId", headerName: "Project ID", flex: 1 },
            {
                field: "dateFrom",
                headerName: "Date From",
                flex: 1,
                // Store original date for sorting, display formatted
                sortComparator: (v1, v2) => {
                    const d1 = parse(v1, "dd-MM-yyyy", new Date());
                    const d2 = parse(v2, "dd-MM-yyyy", new Date());
                    return d1.getTime() - d2.getTime();
                }
            },
            {
                field: "dateTo",
                headerName: "Date To",
                flex: 1,
                sortComparator: (v1, v2) => {
                    const d1 = parse(v1, "dd-MM-yyyy", new Date());
                    const d2 = parse(v2, "dd-MM-yyyy", new Date());
                    return d1.getTime() - d2.getTime();
                }
            },
        ],
        []
    );

    const rows = useMemo(
        () =>
            records.map((r, index) => ({
                id: index,
                empId: r.empId,
                projectId: r.projectId,
                dateFrom: format(r.dateFrom, "dd-MM-yyyy"),
                dateTo: format(r.dateTo, "dd-MM-yyyy"),
            })),
        [records]
    );

    if (!fileName) {
        return (
            <Typography mt={3} color="text.secondary" textAlign="center">
                Please upload a CSV file first.
            </Typography>
        );
    }

    if (records.length === 0) {
        return (
            <Typography mt={3} color="text.secondary" textAlign="center">
                No records loaded.
            </Typography>
        );
    }

    return (
        <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
            <Box height={450}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[10, 20, 50]}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    aria-label="Employee records table"
                />
            </Box>
        </Paper>
    );
};

export default RecordsTable;