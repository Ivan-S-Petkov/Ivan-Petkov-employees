import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import ResultsPage from "../ResultsPage";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

jest.mock("../../components/ResultsTable", () => () => <div data-testid="results-table">ResultsTable</div>);

jest.mock("../../components/PageHeader", () => (props: { title: string; description: string }) => (
    <header>
        <h1>{props.title}</h1>
        <p>{props.description}</p>
    </header>
));

describe("ResultsPage", () => {
    beforeEach(() => {
        mockNavigate.mockReset();
    });

    it("renders header, results table and back button", () => {
        render(<ResultsPage />);

        expect(screen.getByText("Longest Working Employee Pair")).toBeInTheDocument();
        expect(screen.getByTestId("results-table")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
    });

    it("navigates back to /records", () => {
        render(<ResultsPage />);

        fireEvent.click(screen.getByRole("button", { name: "Back" }));
        expect(mockNavigate).toHaveBeenCalledWith("/records");
    });
});