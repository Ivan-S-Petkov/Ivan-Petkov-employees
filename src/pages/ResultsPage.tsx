import { useNavigate } from "react-router-dom";
import ResultsTable from "../components/ResultsTable";
import PageHeader from "../components/PageHeader";
import PageNavigation from "../components/PageNavigation";

const ResultsPage = () => {
    const navigate = useNavigate();

    return (
        <>
            <PageHeader
                title="Longest Working Employee Pair"
                description="Below is the pair of employees who worked together the longest, along with their common projects and days worked."
            />

            <ResultsTable />

            <PageNavigation
                onBack={() => navigate("/records")}
                onContinue={() => { }}
                backLabel="Back"
                continueDisabled={true}

            />
        </>
    );
};

export default ResultsPage;