import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FileUploader from "../FileUploader";
import * as csvUtils from "../../utils/parseCsv";
import type { ParseCsvResult } from "../../utils/parseCsv";

const parseCsv = csvUtils.parseCsv as jest.Mock;

const mockSetFileName = jest.fn();
const mockSetRecords = jest.fn();
const mockSetPairs = jest.fn();
const mockReset = jest.fn();

jest.mock("../../context/EmployeesContext", () => ({
    useEmployees: () => ({
        fileName: "",
        setFileName: mockSetFileName,
        setRecords: mockSetRecords,
        setPairs: mockSetPairs,
        reset: mockReset,
    }),
}));

jest.mock("../../utils/parseCsv", () => ({
    parseCsv: jest.fn(),
}));

jest.mock("../../utils/calculatePairs", () => ({
    calculatePairs: jest.fn(() => [{ emp1: 1, emp2: 2, projectId: 1, daysWorked: 10 }]),
}));

function createFile(name: string, type: string) {
    const file = new File(["dummy"], name, { type });
    return file;
}

describe("FileUploader", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders upload button", () => {
        render(<FileUploader />);
        expect(screen.getByRole("button", { name: /upload csv/i })).toBeInTheDocument();
    });

    it("shows file name after upload", async () => {
        render(<FileUploader />);
        const file = createFile("test.csv", "text/csv");
        parseCsv.mockResolvedValueOnce({ records: [], ambiguousRows: [] });
        const input = screen.getByLabelText(/upload csv/i);
        fireEvent.change(input, { target: { files: [file] } });
        await waitFor(() => {
            expect(mockSetFileName).toHaveBeenCalledWith("test.csv");
        });
    });

    it("shows error for wrong file type", async () => {
        render(<FileUploader />);
        const file = createFile("test.txt", "text/plain");
        const input = screen.getByLabelText(/upload csv/i);
        fireEvent.change(input, { target: { files: [file] } });
        await waitFor(() => {
            expect(screen.getByText(/file must be a csv/i)).toBeInTheDocument();
        });
    });

    it("shows error if parseCsv throws", async () => {
        render(<FileUploader />);
        const file = createFile("test.csv", "text/csv");
        parseCsv.mockRejectedValueOnce(new Error("Parse error"));
        const input = screen.getByLabelText(/upload csv/i);
        fireEvent.change(input, { target: { files: [file] } });
        await waitFor(() => {
            expect(screen.getByText(/parse error/i)).toBeInTheDocument();
        });
    });

    it("calls setRecords with records and ambiguous rows", async () => {
        render(<FileUploader />);
        const file = createFile("test.csv", "text/csv");
        const mockRecords = [
            { empId: 1, projectId: 100, dateFrom: new Date("2020-01-01"), dateTo: new Date("2020-02-01") },
            { empId: 2, projectId: 100, dateFrom: new Date("2020-03-01"), dateTo: new Date("2020-04-01") },
        ];
        const mockResult: ParseCsvResult = {
            records: mockRecords,
            ambiguousRows: [2],
        };
        parseCsv.mockResolvedValueOnce(mockResult);
        const input = screen.getByLabelText(/upload csv/i);
        fireEvent.change(input, { target: { files: [file] } });
        await waitFor(() => {
            expect(mockSetRecords).toHaveBeenCalledWith(mockRecords, [2]);
        });
    });

    it("calculates pairs from parsed records", async () => {
        render(<FileUploader />);
        const file = createFile("test.csv", "text/csv");
        const mockRecords = [
            { empId: 1, projectId: 100, dateFrom: new Date("2020-01-01"), dateTo: new Date("2020-02-01") },
            { empId: 2, projectId: 100, dateFrom: new Date("2020-01-15"), dateTo: new Date("2020-02-15") },
        ];
        parseCsv.mockResolvedValueOnce({ records: mockRecords, ambiguousRows: [] });
        const input = screen.getByLabelText(/upload csv/i);
        fireEvent.change(input, { target: { files: [file] } });
        await waitFor(() => {
            expect(mockSetRecords).toHaveBeenCalledWith(mockRecords, []);
            expect(mockSetPairs).toHaveBeenCalled();
        });
    });

    it("handles sample CSV with no overlaps", async () => {
        render(<FileUploader />);
        const file = createFile("csv4 - no overlaps.csv", "text/csv");
        const mockRecords = [
            { empId: 1, projectId: 100, dateFrom: new Date("2020-01-01"), dateTo: new Date("2020-02-01") },
            { empId: 2, projectId: 100, dateFrom: new Date("2020-03-01"), dateTo: new Date("2020-04-01") },
            { empId: 3, projectId: 100, dateFrom: new Date("2020-05-01"), dateTo: new Date("2020-06-01") },
        ];
        parseCsv.mockResolvedValueOnce({ records: mockRecords, ambiguousRows: [] });
        const input = screen.getByLabelText(/upload csv/i);
        fireEvent.change(input, { target: { files: [file] } });
        await waitFor(() => {
            expect(mockSetFileName).toHaveBeenCalledWith("csv4 - no overlaps.csv");
            expect(mockSetRecords).toHaveBeenCalledWith(mockRecords, []);
            expect(mockSetPairs).toHaveBeenCalled();
        });
    });

    it("handles CSV with ambiguous dates", async () => {
        render(<FileUploader />);
        const file = createFile("test.csv", "text/csv");
        const mockRecords = [
            { empId: 1, projectId: 100, dateFrom: new Date("2020-01-05"), dateTo: new Date("2020-02-01") },
        ];
        parseCsv.mockResolvedValueOnce({ records: mockRecords, ambiguousRows: [2] });
        const input = screen.getByLabelText(/upload csv/i);
        fireEvent.change(input, { target: { files: [file] } });
        await waitFor(() => {
            expect(mockSetRecords).toHaveBeenCalledWith(mockRecords, [2]);
        });
    });
});