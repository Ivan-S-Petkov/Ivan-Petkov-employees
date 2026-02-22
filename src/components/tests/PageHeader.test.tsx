import { render, screen } from "@testing-library/react";
import PageHeader from "../PageHeader";

describe("PageHeader", () => {
    it("renders the title", () => {
        render(<PageHeader title="Test Title" />);
        expect(screen.getByText("Test Title")).toBeInTheDocument();
    });

    it("renders the description when provided", () => {
        render(<PageHeader title="Test Title" description="Test Description" />);
        expect(screen.getByText("Test Description")).toBeInTheDocument();
    });

    it("does not render description when not provided", () => {
        render(<PageHeader title="Test Title" />);
        expect(screen.queryByText("Test Description")).not.toBeInTheDocument();
    });
});
