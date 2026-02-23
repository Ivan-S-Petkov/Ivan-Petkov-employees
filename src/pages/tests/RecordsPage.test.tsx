import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import RecordsPage from "../RecordsPage";
import type { EmployeeRecord } from "../../types/EmployeeRecord";
import type { PageNavigationProps } from "../../components/PageNavigation";

const mockNavigate = jest.fn();
let mockRecords: EmployeeRecord[] = [];
let mockAmbiguousRows: number[] = [];

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

jest.mock("../../context/EmployeesContext", () => ({
    useEmployees: () => ({
        records: mockRecords,
        ambiguousRows: mockAmbiguousRows,
    }),
}));

jest.mock("../../components/RecordsTable", () => () => <div data-testid="records-table">RecordsTable</div>);

jest.mock("../../components/PageHeader", () => (props: { title: string; description: string }) => (
    <header>
        <h1>{props.title}</h1>
        <p>{props.description}</p>
    </header>
));

jest.mock("../../components/PageNavigation", () => (props: PageNavigationProps) => (
    <div>
        <button onClick={props.onBack}>Back</button>
        <button onClick={props.onContinue} disabled={props.continueDisabled}>
            {props.continueLabel ?? "Continue"}
        </button>
    </div>
));

describe("RecordsPage", () => {
    beforeEach(() => {
        mockNavigate.mockReset();
        mockRecords = [];
        mockAmbiguousRows = [];
    });

    it("renders page content and disables 'View Results' when there are no records", () => {
        render(<RecordsPage />);

        expect(screen.getByText("Imported Records")).toBeInTheDocument();
        expect(
            screen.getByText("These are the raw employee project assignments parsed from your CSV file.")
        ).toBeInTheDocument();
        expect(screen.getByTestId("records-table")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "View Results" })).toBeDisabled();
    });

    it("does not show ambiguous dates warning when none exist", () => {
        mockRecords = [{} as EmployeeRecord];
        render(<RecordsPage />);

        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
        expect(screen.queryByText(/Ambiguous Dates Detected/i)).not.toBeInTheDocument();
    });

    it("shows ambiguous dates warning with provided row numbers (including duplicates)", () => {
        mockRecords = [{} as EmployeeRecord];
        mockAmbiguousRows = [2, 2, 5];
        render(<RecordsPage />);

        const alert = screen.getByRole("alert");
        expect(screen.getByText(/Ambiguous Dates Detected/i)).toBeInTheDocument();
        expect(alert).toHaveTextContent(/Rows\s*2,\s*2,\s*5\s*contain dates/i);
        expect(alert).toHaveAttribute("aria-live", "polite");
    });

    it("shows ambiguous warning with a single row number", () => {
        mockRecords = [{} as EmployeeRecord];
        mockAmbiguousRows = [7];
        render(<RecordsPage />);

        expect(screen.getByRole("alert")).toHaveTextContent(/Rows\s*7\s*contain dates/i);
    });

    it("navigates back to '/'", () => {
        mockRecords = [{} as EmployeeRecord];
        render(<RecordsPage />);

        fireEvent.click(screen.getByRole("button", { name: "Back" }));
        expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("enables 'View Results' with records and navigates to '/results'", () => {
        mockRecords = [{} as EmployeeRecord];
        render(<RecordsPage />);

        const resultsBtn = screen.getByRole("button", { name: "View Results" });
        expect(resultsBtn).not.toBeDisabled();

        fireEvent.click(resultsBtn);
        expect(mockNavigate).toHaveBeenCalledWith("/results");
    });

    it("does not navigate to '/results' when 'View Results' is disabled", () => {
        render(<RecordsPage />);

        const resultsBtn = screen.getByRole("button", { name: "View Results" });
        expect(resultsBtn).toBeDisabled();

        fireEvent.click(resultsBtn);
        expect(mockNavigate).not.toHaveBeenCalledWith("/results");
    });
});