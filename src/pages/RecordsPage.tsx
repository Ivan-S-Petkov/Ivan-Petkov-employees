import { useNavigate } from "react-router-dom";
import { useEmployees } from "../context/EmployeesContext";
import RecordsTable from "../components/RecordsTable";
import PageHeader from "../components/PageHeader";
import PageNavigation from "../components/PageNavigation";
import { Alert, AlertTitle } from "@mui/material";

const RecordsPage = () => {
    const { records, ambiguousRows } = useEmployees();
    const navigate = useNavigate();

    return (
        <>
            <PageHeader
                title="Imported Records"
                description="These are the raw employee project assignments parsed from your CSV file."
            />

            {ambiguousRows.length > 0 && (
                <Alert
                    severity="warning"
                    sx={{ mb: 2 }}
                    role="alert"
                    aria-live="polite"
                >
                    <AlertTitle>Ambiguous Dates Detected</AlertTitle>
                    Rows {ambiguousRows.join(", ")} contain dates that could be
                    interpreted in multiple formats (e.g., 01/05/2005). We parsed
                    them as MM/dd/yyyy. Please verify they're correct.
                </Alert>
            )}

            <RecordsTable />

            <PageNavigation
                onBack={() => navigate("/")}
                onContinue={() => navigate("/results")}
                continueDisabled={records.length === 0}
                continueLabel="View Results"
            />
        </>
    );
};

export default RecordsPage;