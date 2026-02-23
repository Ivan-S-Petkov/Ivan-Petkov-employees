import { renderHook, act } from "@testing-library/react";
import { EmployeesProvider, useEmployees } from "./EmployeesContext";
import type { EmployeeRecord } from "../types/EmployeeRecord";
import type { PairResult } from "../types/PairResult";

describe("EmployeesContext", () => {
    const mockRecord: EmployeeRecord = {
        empId: 1,
        projectId: 100,
        dateFrom: new Date("2023-01-01"),
        dateTo: new Date("2023-01-31"),
    };

    const mockPair: PairResult = {
        emp1: 1,
        emp2: 2,
        projectId: 100,
        daysWorked: 30,
    };

    it("initializes with default values", () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <EmployeesProvider>{children}</EmployeesProvider>
        );

        const { result } = renderHook(() => useEmployees(), { wrapper });

        expect(result.current.fileName).toBeNull();
        expect(result.current.records).toEqual([]);
        expect(result.current.pairs).toEqual([]);
        expect(result.current.ambiguousRows).toEqual([]);
    });

    it("sets fileName", () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <EmployeesProvider>{children}</EmployeesProvider>
        );

        const { result } = renderHook(() => useEmployees(), { wrapper });

        act(() => {
            result.current.setFileName("test.csv");
        });

        expect(result.current.fileName).toBe("test.csv");
    });

    it("sets records and ambiguous rows together", () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <EmployeesProvider>{children}</EmployeesProvider>
        );

        const { result } = renderHook(() => useEmployees(), { wrapper });

        act(() => {
            result.current.setRecords([mockRecord], [2, 5]);
        });

        expect(result.current.records).toEqual([mockRecord]);
        expect(result.current.ambiguousRows).toEqual([2, 5]);
    });

    it("sets records without ambiguous rows", () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <EmployeesProvider>{children}</EmployeesProvider>
        );

        const { result } = renderHook(() => useEmployees(), { wrapper });

        act(() => {
            result.current.setRecords([mockRecord], []);
        });

        expect(result.current.records).toEqual([mockRecord]);
        expect(result.current.ambiguousRows).toEqual([]);
    });

    it("sets multiple records", () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <EmployeesProvider>{children}</EmployeesProvider>
        );

        const { result } = renderHook(() => useEmployees(), { wrapper });

        const records = [mockRecord, { ...mockRecord, empId: 2 }];

        act(() => {
            result.current.setRecords(records, []);
        });

        expect(result.current.records).toHaveLength(2);
    });

    it("sets pairs", () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <EmployeesProvider>{children}</EmployeesProvider>
        );

        const { result } = renderHook(() => useEmployees(), { wrapper });

        act(() => {
            result.current.setPairs([mockPair]);
        });

        expect(result.current.pairs).toEqual([mockPair]);
    });

    it("resets all state to defaults", () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <EmployeesProvider>{children}</EmployeesProvider>
        );

        const { result } = renderHook(() => useEmployees(), { wrapper });

        // Set initial state
        act(() => {
            result.current.setFileName("test.csv");
            result.current.setRecords([mockRecord], [2]);
            result.current.setPairs([mockPair]);
        });

        expect(result.current.fileName).toBe("test.csv");
        expect(result.current.records).toHaveLength(1);
        expect(result.current.pairs).toHaveLength(1);

        // Reset
        act(() => {
            result.current.reset();
        });

        expect(result.current.records).toEqual([]);
        expect(result.current.pairs).toEqual([]);
        expect(result.current.ambiguousRows).toEqual([]);
    });

    it("throws error when useEmployees is used outside EmployeesProvider", () => {
        // Suppress console.error for this test
        const spy = jest.spyOn(console, "error").mockImplementation(() => { });

        expect(() => {
            renderHook(() => useEmployees());
        }).toThrow("useEmployees must be used inside EmployeesProvider");

        spy.mockRestore();
    });
});