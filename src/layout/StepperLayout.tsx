import React, { useCallback, useMemo } from "react";
import {
    Stepper,
    Step,
    StepLabel,
    Box,
    Container,
    Paper,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useEmployees } from "../context/EmployeesContext";

const steps = ["Upload CSV", "Imported Records", "Results"];

interface StepperLayoutProps {
    children: React.ReactNode;
}

const StepperLayout = ({ children }: StepperLayoutProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { records, pairs } = useEmployees();

    const activeStep = useMemo(() => {
        if (location.pathname === "/") return 0;
        if (location.pathname === "/records") return 1;
        return 2;
    }, [location.pathname]);

    const canGoTo = useCallback(
        (stepIndex: number) => {
            if (stepIndex === 0) return true;
            if (stepIndex === 1) return records.length > 0;
            if (stepIndex === 2) return pairs.length > 0;
            return false;
        },
        [records.length, pairs.length]
    );

    const handleStepClick = useCallback(
        (index: number) => {
            if (!canGoTo(index)) return;
            if (index === 0) navigate("/");
            if (index === 1) navigate("/records");
            if (index === 2) navigate("/results");
        },
        [canGoTo, navigate]
    );

    return (
        <Container maxWidth="lg" sx={{ padding: 0.5 }}>
            <Paper
                elevation={3}
                sx={{
                    p: { xs: 2, sm: 3, md: 4 },
                    borderRadius: { xs: 2, sm: 3 },
                }}
            >
                <Stepper
                    activeStep={activeStep}
                    alternativeLabel
                    sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
                >
                    {steps.map((label, index) => (
                        <Step
                            key={label}
                            onClick={() => handleStepClick(index)}
                            sx={{
                                cursor: canGoTo(index) ? "pointer" : "not-allowed",
                                opacity: canGoTo(index) ? 1 : 0.4,
                            }}
                        >
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Box>{children}</Box>
            </Paper>
        </Container>
    );
};

export default StepperLayout;