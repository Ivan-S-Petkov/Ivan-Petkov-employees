import FileUploader from "../components/FileUploader";
import { useLocation, useNavigate } from "react-router-dom";
import { useEmployees } from "../context/EmployeesContext";
import PageHeader from "../components/PageHeader";
import PageNavigation from "../components/PageNavigation";

const UploadPage = () => {
    const { records } = useEmployees();
    const navigate = useNavigate();
    const location = useLocation();

    const isFirstStep = location.pathname === "/";

    return (
        <>
            <PageHeader
                title="Upload CSV File"
                description="Select a CSV file to load employee project assignments."
            />

            <FileUploader />

            <PageNavigation
                onBack={() => navigate(-1)}
                onContinue={() => navigate("/records")}
                backDisabled={isFirstStep}
                continueDisabled={records.length === 0}
            />
        </>
    );
};

export default UploadPage;