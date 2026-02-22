import React from "react";
import { Typography } from "@mui/material";

interface PageHeaderProps {
    title: string;
    description?: string;
}

const PageHeader = React.memo(({ title, description }: PageHeaderProps) => (
    <>
        <Typography variant="h5" fontWeight={600} gutterBottom>
            {title}
        </Typography>
        {description && (
            <Typography variant="body1" color="text.secondary" mb={3}>
                {description}
            </Typography>
        )}
    </>
));

export default PageHeader;