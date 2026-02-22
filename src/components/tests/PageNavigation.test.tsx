import { render, screen, fireEvent } from "@testing-library/react";
import PageNavigation from "../PageNavigation";

describe("PageNavigation", () => {
    it("renders Back and Continue buttons with default labels", () => {
        render(
            <PageNavigation onBack={() => { }} onContinue={() => { }} />
        );
        expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /continue/i })).toBeInTheDocument();
    });

    it("renders custom labels", () => {
        render(
            <PageNavigation
                onBack={() => { }}
                onContinue={() => { }}
                backLabel="Previous"
                continueLabel="Next"
            />
        );
        expect(screen.getByRole("button", { name: /previous/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
    });

    it("calls onBack and onContinue when buttons are clicked", () => {
        const onBack = jest.fn();
        const onContinue = jest.fn();
        render(
            <PageNavigation onBack={onBack} onContinue={onContinue} />
        );
        fireEvent.click(screen.getByRole("button", { name: /back/i }));
        fireEvent.click(screen.getByRole("button", { name: /continue/i }));
        expect(onBack).toHaveBeenCalledTimes(1);
        expect(onContinue).toHaveBeenCalledTimes(1);
    });

    it("disables buttons when props are set", () => {
        render(
            <PageNavigation
                onBack={() => { }}
                onContinue={() => { }}
                backDisabled
                continueDisabled
            />
        );
        expect(screen.getByRole("button", { name: /back/i })).toBeDisabled();
        expect(screen.getByRole("button", { name: /continue/i })).toBeDisabled();
    });
});
