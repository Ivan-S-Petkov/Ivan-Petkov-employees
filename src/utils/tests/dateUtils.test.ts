import { parseFlexibleDate } from "../dateUtils";

describe("parseFlexibleDate", () => {
  it("parses yyyy-MM-dd format", () => {
    const result = parseFlexibleDate("2023-01-15");
    expect(result.date.getFullYear()).toBe(2023);
    expect(result.date.getMonth()).toBe(0);
    expect(result.date.getDate()).toBe(15);
    expect(result.isAmbiguous).toBe(false);
  });

  it("parses MM/dd/yyyy format", () => {
    const result = parseFlexibleDate("01/15/2023");
    expect(result.date.getFullYear()).toBe(2023);
    expect(result.date.getMonth()).toBe(0);
    expect(result.date.getDate()).toBe(15);
    expect(result.isAmbiguous).toBe(false);
  });

  it("detects ambiguous dates (01/05/2005)", () => {
    const result = parseFlexibleDate("01/05/2005");
    expect(result.isAmbiguous).toBe(true);
    // Uses first format: MM/dd/yyyy = January 5
    expect(result.date.getMonth()).toBe(0);
    expect(result.date.getDate()).toBe(5);
  });

  it("returns today for null input", () => {
    const today = new Date();
    const result = parseFlexibleDate(null);
    expect(result.date.getFullYear()).toBe(today.getFullYear());
    expect(result.date.getMonth()).toBe(today.getMonth());
    expect(result.date.getDate()).toBe(today.getDate());
    expect(result.isAmbiguous).toBe(false);
  });

  it("returns today for 'NULL' string (case-insensitive)", () => {
    const today = new Date();
    const result = parseFlexibleDate("NULL");
    expect(result.date.getFullYear()).toBe(today.getFullYear());
    expect(result.isAmbiguous).toBe(false);
  });

  it("normalizes dates to UTC midnight", () => {
    const result = parseFlexibleDate("2023-01-15");
    expect(result.date.getUTCHours()).toBe(0);
    expect(result.date.getUTCMinutes()).toBe(0);
    expect(result.date.getUTCSeconds()).toBe(0);
  });

  it("throws error for unsupported date format", () => {
    expect(() => parseFlexibleDate("15.01.2023")).toThrow(
      "Unsupported date format: 15.01.2023",
    );
  });

  it("handles leap year dates", () => {
    const result = parseFlexibleDate("2020-02-29");
    expect(result.date.getDate()).toBe(29);
    expect(result.isAmbiguous).toBe(false);
  });
});
