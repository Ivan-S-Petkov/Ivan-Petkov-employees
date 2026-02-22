import React from "react";
import { Box, Button } from "@mui/material";

export interface PageNavigationProps {
    onBack: () => void;
    onContinue: () => void;
    backDisabled?: boolean;
    continueDisabled?: boolean;
    backLabel?: string;
    continueLabel?: string;
}

const PageNavigation = React.memo(({
    onBack,
    onContinue,
    backDisabled = false,
    continueDisabled = false,
    backLabel = "Back",
    continueLabel = "Continue",
}: PageNavigationProps) => (
    <Box mt={3} display="flex" gap={2} justifyContent="space-between">
        <Button
            variant="outlined"
            onClick={onBack}
            disabled={backDisabled}
            aria-label={backLabel}
        >
            {backLabel}
        </Button>
        <Button
            variant="contained"
            onClick={onContinue}
            disabled={continueDisabled}
            aria-label={continueLabel}
        >
            {continueLabel}
        </Button>
    </Box>
));

export default PageNavigation;
