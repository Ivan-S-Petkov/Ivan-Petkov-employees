import React, { useCallback, useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import { parseCsv } from "../utils/parseCsv";
import { calculatePairs } from "../utils/calculatePairs";
import { useEmployees } from "../context/EmployeesContext";
import { fileSchema } from "./validations/fileValidation";

const FileUploader = () => {
    const { fileName, setFileName, setRecords, setPairs, reset } = useEmployees();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);
        reset();
        setFileName(file.name);
        setLoading(true);

        const result = fileSchema.safeParse(file);
        if (!result.success) {
            setError(result.error.issues[0].message);
            return;
        }

        try {
            const { records, ambiguousRows } = await parseCsv(file);
            setRecords(records, ambiguousRows);

            const pairs = calculatePairs(records);
            setPairs(pairs);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Failed to parse file");
            }
        } finally {
            setLoading(false);
        }
    }, [setFileName, setRecords, setPairs, reset]);

    return (
        <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <Button variant="contained" component="label">
                Upload CSV
                <input
                    type="file"
                    accept=".csv"
                    hidden
                    onChange={e => {
                        handleFileChange(e);
                        e.target.value = ""; // Reset input to allow re-uploading same file
                    }}
                />
            </Button>

            {loading && (
                <Typography variant="body2" color="text.secondary">
                    Parsing file, please wait...
                </Typography>
            )}
            {fileName && (
                <Typography variant="body2" color="text.secondary" aria-live="polite">
                    Selected file: {fileName}
                </Typography>
            )}
            {error && (
                <Typography variant="body2" color="error" aria-live="assertive">
                    {error}
                </Typography>
            )}
        </Box>
    );
};

export default FileUploader;