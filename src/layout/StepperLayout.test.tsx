import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";
import StepperLayout from "../layout/StepperLayout";
import type { EmployeeRecord } from "../types/EmployeeRecord";
import type { PairResult } from "../types/PairResult";

let mockRecords: EmployeeRecord[];
let mockPairs: PairResult[];

jest.mock("../context/EmployeesContext", () => ({
    useEmployees: () => ({
        records: mockRecords,
        pairs: mockPairs,
    }),
}));

const LocationProbe = () => {
    const location = useLocation();
    return <div data-testid="location">{location.pathname}</div>;
};

const renderWithRouter = (initialPath: string, child: React.ReactNode = <div>Test</div>) =>
    render(
        <MemoryRouter initialEntries={[initialPath]}>
            <StepperLayout>{child}</StepperLayout>
            <LocationProbe />
        </MemoryRouter>
    );

const getStepRoot = (label: RegExp) => screen.getByText(label).closest(".MuiStep-root") as HTMLElement;

describe("StepperLayout", () => {
    beforeEach(() => {
        mockRecords = [];
        mockPairs = [];
    });

    it("renders children and highlights Upload CSV for /", () => {
        renderWithRouter("/", <div data-testid="child-content">Test Content</div>);
        expect(screen.getByTestId("child-content")).toBeInTheDocument();
        expect(screen.getByText(/upload csv/i)).toHaveClass("Mui-active");
    });

    it("highlights Imported Records for /records", () => {
        mockRecords = [{} as EmployeeRecord];
        renderWithRouter("/records", <div>Records Step</div>);
        expect(screen.getByText(/imported records/i)).toHaveClass("Mui-active");
    });

    it("highlights Results for /results", () => {
        mockRecords = [{} as EmployeeRecord];
        mockPairs = [{ emp1: 1, emp2: 2, projectId: 100, daysWorked: 30 }];
        renderWithRouter("/results", <div>Results Step</div>);
        expect(screen.getByText(/^results$/i)).toHaveClass("Mui-active");
    });

    it("disables Imported Records and Results when records and pairs are missing", () => {
        renderWithRouter("/");
        expect(getStepRoot(/imported records/i)).toHaveStyle("opacity: 0.4");
        expect(getStepRoot(/^results$/i)).toHaveStyle("opacity: 0.4");
        expect(getStepRoot(/imported records/i)).toHaveStyle("cursor: not-allowed");
        expect(getStepRoot(/^results$/i)).toHaveStyle("cursor: not-allowed");
    });

    it("allows navigation to /records when records exist", async () => {
        const user = userEvent.setup();
        mockRecords = [{} as EmployeeRecord];

        renderWithRouter("/");
        await user.click(screen.getByText(/imported records/i));

        expect(screen.getByTestId("location")).toHaveTextContent("/records");
    });

    it("prevents navigation to /records when records are missing", async () => {
        const user = userEvent.setup();

        renderWithRouter("/");
        await user.click(screen.getByText(/imported records/i));

        expect(screen.getByTestId("location")).toHaveTextContent("/");
    });

    it("allows navigation to /results when pairs exist", async () => {
        const user = userEvent.setup();
        mockRecords = [{} as EmployeeRecord];
        mockPairs = [{ emp1: 1, emp2: 2, projectId: 100, daysWorked: 30 } as PairResult];

        renderWithRouter("/records");
        await user.click(screen.getByText(/^results$/i));

        expect(screen.getByTestId("location")).toHaveTextContent("/results");
    });

    it("falls back to Results step for unknown routes", () => {
        mockRecords = [{} as EmployeeRecord];
        mockPairs = [{ emp1: 1, emp2: 2, projectId: 100, daysWorked: 30 } as PairResult];

        renderWithRouter("/unknown");
        expect(screen.getByText(/^results$/i)).toHaveClass("Mui-active");
    });
});