import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from '@mui/x-data-grid';
import { Box, Typography } from "@mui/material";
import { useEmployees } from "../context/EmployeesContext";
import { useMemo } from "react";

const ResultsTable = () => {
    const { fileName, records, pairs } = useEmployees();

    const columns = useMemo<GridColDef[]>(
        () => [
            { field: "emp1", headerName: "Employee ID #1", flex: 1 },
            { field: "emp2", headerName: "Employee ID #2", flex: 1 },
            { field: "projectId", headerName: "Project ID", flex: 1 },
            { field: "daysWorked", headerName: "Days Worked", flex: 1 },
        ],
        []
    );

    const { bestEmp1, bestEmp2, bestTotal, filteredPairs } = useMemo(() => {
        // Step 1: Group by pair
        const totals = new Map();
        for (const p of pairs) {
            const key = `${p.emp1}-${p.emp2}`;
            totals.set(key, (totals.get(key) || 0) + p.daysWorked);
        }

        // Step 2: Find the pair with the highest total
        let bestKey = null;
        let bestTotal = 0;
        for (const [key, total] of totals.entries()) {
            if (total > bestTotal) {
                bestTotal = total;
                bestKey = key;
            }
        }

        const [bestEmp1, bestEmp2] = bestKey ? bestKey.split("-") : [null, null];

        // Step 3: Filter all projects for that pair
        const filteredPairs = pairs.filter(
            p => p.emp1 === Number(bestEmp1) && p.emp2 === Number(bestEmp2)
        );

        return { bestEmp1, bestEmp2, bestTotal, filteredPairs };
    }, [pairs]);

    if (!fileName || records.length === 0) {
        return (
            <Typography mt={3} color="text.secondary" textAlign="center">
                Please upload a CSV file first.
            </Typography>
        );
    }


    if (pairs.length === 0) {
        return (
            <Typography mt={3} color="text.secondary" textAlign="center">
                <strong>No employee pairs found.</strong><br />
                This means that, based on your uploaded data, no two employees have worked together on the same project at the same time.<br />
            </Typography>
        );
    }

    return (
        <Box mt={3}>
            <Box mb={2} p={2} bgcolor="background.paper" borderRadius={2} boxShadow={1}>
                <Typography variant="h6" gutterBottom>
                    Longest Working Pair
                </Typography>
                <Typography>
                    <strong>Employee ID #1:</strong> {bestEmp1}<br />
                    <strong>Employee ID #2:</strong> {bestEmp2}<br />
                    <strong>Total Days Worked Together:</strong> {bestTotal}
                </Typography>

            </Box>
            <Box height={400}>
                <DataGrid
                    rows={filteredPairs.map((p, index) => ({ id: index, ...p }))}
                    columns={columns}
                    pageSizeOptions={[5, 10, 20]}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                        sorting: {
                            sortModel: [
                                { field: 'daysWorked', sort: 'desc' },
                            ],
                        },
                    }}
                />
            </Box>
        </Box>
    );
};

export default ResultsTable;