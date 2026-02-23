import React, { createContext, useContext, useState, useMemo } from "react";
import type { EmployeeRecord } from "../types/EmployeeRecord";
import type { PairResult } from "../types/PairResult";

interface EmployeesContextState {
    fileName: string | null;
    records: EmployeeRecord[];
    pairs: PairResult[];
    ambiguousRows: number[];
    setFileName: (fileName: string | null) => void;
    setRecords: (records: EmployeeRecord[], ambiguousRows: number[]) => void;
    setPairs: (pairs: PairResult[]) => void;
    reset: () => void;
}

const EmployeesContext = createContext<EmployeesContextState | undefined>(undefined);

export const EmployeesProvider = ({ children }: { children: React.ReactNode }) => {
    const [fileName, setFileName] = useState<string | null>(null);
    const [records, setRecords] = useState<EmployeeRecord[]>([]);
    const [pairs, setPairs] = useState<PairResult[]>([]);
    const [ambiguousRows, setAmbiguousRows] = useState<number[]>([]);

    const handleSetRecords = (records: EmployeeRecord[], ambiguousRows: number[]) => {
        setRecords(records);
        setAmbiguousRows(ambiguousRows);
    };

    const reset = () => {
        setFileName(null);
        setRecords([]);
        setPairs([]);
        setAmbiguousRows([]);
    };

    const value = useMemo(
        () => ({
            fileName,
            records,
            pairs,
            ambiguousRows,
            setFileName,
            setRecords: handleSetRecords,
            setPairs,
            reset,
        }),
        [fileName, records, pairs, ambiguousRows]
    );

    return (
        <EmployeesContext.Provider value={value}>
            {children}
        </EmployeesContext.Provider>
    );
};

export const useEmployees = () => {
    const ctx = useContext(EmployeesContext);
    if (!ctx) {
        throw new Error("useEmployees must be used inside EmployeesProvider");
    }
    return ctx;
};