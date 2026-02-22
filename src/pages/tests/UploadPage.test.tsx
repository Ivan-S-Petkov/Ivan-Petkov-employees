import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import UploadPage from "../UploadPage";
import type { EmployeeRecord } from "../../types/EmployeeRecord";
import type { PageNavigationProps } from "../../components/PageNavigation";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = jest.fn();
let mockRecords: EmployeeRecord[] = [];

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
    useLocation: jest.requireActual("react-router-dom").useLocation,
}));

jest.mock("../../context/EmployeesContext", () => ({
    useEmployees: () => ({
        records: mockRecords,
    }),
}));

jest.mock("../../components/FileUploader", () => () => <div data-testid="file-uploader">Uploader</div>);

jest.mock("../../components/PageHeader", () => (props: { title: string; description: string }) => (
    <header>
        <h1>{props.title}</h1>
        <p>{props.description}</p>
    </header>
));

jest.mock("../../components/PageNavigation", () => (props: PageNavigationProps) => (
    <div>
        <button onClick={props.onBack} disabled={props.backDisabled}>
            Back
        </button>
        <button onClick={props.onContinue} disabled={props.continueDisabled}>
            Continue
        </button>
    </div>
));

describe("UploadPage", () => {
    beforeEach(() => {
        mockNavigate.mockReset();
        mockRecords = [];
        window.history.pushState({}, "", "/");
    });

    it("renders header/uploader and disables Back + Continue on first step with no records", () => {
        render(
            <MemoryRouter initialEntries={["/"]}>
                <UploadPage />
            </MemoryRouter>
        );

        expect(screen.getByText("Upload CSV File")).toBeInTheDocument();
        expect(screen.getByTestId("file-uploader")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Back" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "Continue" })).toBeDisabled();
    });

    it("enables Continue when records exist and navigates to /records", () => {
        mockRecords = [{} as EmployeeRecord];
        render(
            <MemoryRouter initialEntries={["/"]}>
                <UploadPage />
            </MemoryRouter>
        );

        const continueBtn = screen.getByRole("button", { name: "Continue" });
        expect(continueBtn).not.toBeDisabled();

        fireEvent.click(continueBtn);
        expect(mockNavigate).toHaveBeenCalledWith("/records");
    });

    it("enables Back when not on first step and navigates with -1", () => {
        window.history.pushState({}, "", "/records");
        render(
            <MemoryRouter initialEntries={["/records"]}>
                <UploadPage />
            </MemoryRouter>
        );

        const backBtn = screen.getByRole("button", { name: "Back" });
        expect(backBtn).not.toBeDisabled();

        fireEvent.click(backBtn);
        expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
});