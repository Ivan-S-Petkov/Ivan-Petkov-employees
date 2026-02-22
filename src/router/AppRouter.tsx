import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UploadPage from "../pages/UploadPage";
import RecordsPage from "../pages/RecordsPage";
import ResultsPage from "../pages/ResultsPage";
import StepperLayout from "../layout/StepperLayout";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <StepperLayout>
                <Routes>
                    <Route path="/" element={<UploadPage />} />
                    <Route path="/records" element={<RecordsPage />} />
                    <Route path="/results" element={<ResultsPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </StepperLayout>
        </BrowserRouter>
    );
};

export default AppRouter;