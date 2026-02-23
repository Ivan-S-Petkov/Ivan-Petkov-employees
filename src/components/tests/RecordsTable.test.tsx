import { render, screen } from "@testing-library/react";
import RecordsTable from "../RecordsTable";
import type { EmployeeRecord } from "../../types/EmployeeRecord";

let mockFileName: string;
let mockRecords: EmployeeRecord[];

jest.mock("../../context/EmployeesContext", () => ({
    useEmployees: () => ({
        fileName: mockFileName,
        records: mockRecords,
    }),
}));

describe("RecordsTable", () => {
    it("renders DataGrid with records", () => {
        mockFileName = "test.csv";
        mockRecords = [
            {
                empId: 1,
                projectId: 100,
                dateFrom: new Date("2020-01-01"),
                dateTo: new Date("2020-02-01"),
            },
            {
                empId: 2,
                projectId: 100,
                dateFrom: new Date("2020-03-01"),
                dateTo: new Date("2020-04-01"),
            },
        ];
        render(<RecordsTable />);
        expect(screen.getByText(/employee id/i)).toBeInTheDocument();
        expect(screen.getByText(/project id/i)).toBeInTheDocument();
        expect(screen.getByText("1")).toBeInTheDocument();
        expect(screen.getAllByText("100")[0]).toBeInTheDocument();
        expect(screen.getByText("01-01-2020")).toBeInTheDocument();
        expect(screen.getByText("01-02-2020")).toBeInTheDocument();
    });

    it("shows upload prompt if no fileName", () => {
        mockFileName = "";
        mockRecords = [];
        render(<RecordsTable />);
        expect(screen.getByText(/please upload a csv file/i)).toBeInTheDocument();
    });

    it("shows no records message if records is empty", () => {
        mockFileName = "test.csv";
        mockRecords = [];
        render(<RecordsTable />);
        expect(screen.getByText(/no records loaded/i)).toBeInTheDocument();
    });
});
