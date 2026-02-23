import { render, screen } from "@testing-library/react";
import ResultsTable from "../ResultsTable";
import type { EmployeeRecord } from "../../types/EmployeeRecord";
import type { PairResult } from "../../types/PairResult";

let mockFileName: string;
let mockRecords: EmployeeRecord[];
let mockPairs: PairResult[];

jest.mock("../../context/EmployeesContext", () => ({
    useEmployees: () => ({
        fileName: mockFileName,
        records: mockRecords,
        pairs: mockPairs,
    }),
}));

describe("ResultsTable", () => {
    it("renders longest working pair card and filtered DataGrid", () => {
        mockFileName = "test.csv";
        mockRecords = [{ empId: 1, projectId: 100, dateFrom: new Date(), dateTo: new Date() }];
        mockPairs = [
            { emp1: 1, emp2: 2, projectId: 100, daysWorked: 15 },
            { emp1: 1, emp2: 2, projectId: 101, daysWorked: 10 },
            { emp1: 3, emp2: 4, projectId: 102, daysWorked: 20 },
        ];
        render(<ResultsTable />);
        expect(screen.getByText(/longest working pair/i)).toBeInTheDocument();
        expect(screen.getAllByText(/employee id #1/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/employee id #2/i).length).toBeGreaterThan(0);
        expect(screen.getByText(/total days worked together/i)).toBeInTheDocument();
        // Should not show the pair (3,4)
        expect(screen.queryByText("3")).toBeNull();
        expect(screen.queryByText("4")).toBeNull();
        expect(screen.queryByText("20")).toBeNull();
        expect(screen.queryByText("102")).toBeNull();
        // Should show the pair (1,2) with total 25 days
        expect(screen.getAllByText("1").length).toBeGreaterThan(0);
        expect(screen.getAllByText("2").length).toBeGreaterThan(0);
        expect(screen.getByText("100")).toBeInTheDocument();
        expect(screen.getByText("101")).toBeInTheDocument();
    });

    it("shows upload prompt if no fileName or records", () => {
        mockFileName = "";
        mockRecords = [];
        mockPairs = [];
        render(<ResultsTable />);
        expect(screen.getByText(/please upload a csv file/i)).toBeInTheDocument();
    });

    it("shows no pairs message if pairs is empty", () => {
        mockFileName = "test.csv";
        mockRecords = [{ empId: 1, projectId: 100, dateFrom: new Date(), dateTo: new Date() }];
        mockPairs = [];
        render(<ResultsTable />);
        expect(screen.getByText(/no employee pairs found/i)).toBeInTheDocument();
        expect(screen.getByText(/no two employees have worked together/i)).toBeInTheDocument();
    });
});
