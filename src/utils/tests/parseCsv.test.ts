import { parseCsv } from "../parseCsv";

jest.mock("papaparse", () => ({
  parse: jest.fn((file, config) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const lines = text.trim().split("\n");

      if (lines.length === 0) {
        config.complete({ data: [], meta: { fields: [] } });
        return;
      }

      const headers = lines[0].split(",").map((h) => h.trim());
      const data = lines
        .slice(1)
        .filter((line) => line.trim().length > 0)
        .map((line) => {
          const values = line.split(",").map((v) => v.trim());
          const row: Record<string, string> = {};
          headers.forEach((header, i) => {
            row[header] = values[i] || "";
          });
          return row;
        });

      config.complete({ data, meta: { fields: headers } });
    };
    reader.readAsText(file);
  }),
}));

describe("parseCsv", () => {
  const createFile = (content: string): File => {
    return new File([content], "test.csv", { type: "text/csv" });
  };

  it("parses valid CSV with all required headers", async () => {
    const csv = `EmpID,ProjectID,DateFrom,DateTo
1,100,2023-01-01,2023-01-31
2,100,2023-01-15,2023-02-15`;

    const file = createFile(csv);
    const result = await parseCsv(file);

    expect(result.records).toHaveLength(2);
    expect(result.ambiguousRows).toEqual([]);
    expect(result.records[0]).toEqual({
      empId: 1,
      projectId: 100,
      dateFrom: expect.any(Date),
      dateTo: expect.any(Date),
    });
  });

  it("trims whitespace from headers", async () => {
    const csv = ` EmpID , ProjectID , DateFrom , DateTo 
1,100,2023-01-01,2023-01-31`;

    const file = createFile(csv);
    const result = await parseCsv(file);

    expect(result.records).toHaveLength(1);
  });

  it("detects ambiguous dates", async () => {
    const csv = `EmpID,ProjectID,DateFrom,DateTo
1,100,01/05/2023,2023-01-31`;

    const file = createFile(csv);
    const result = await parseCsv(file);

    expect(result.records).toHaveLength(1);
    expect(result.ambiguousRows).toContain(2);
  });

  it("collects all ambiguous rows", async () => {
    const csv = `EmpID,ProjectID,DateFrom,DateTo
1,100,01/05/2023,02/03/2023
2,200,2023-01-01,2023-01-31`;

    const file = createFile(csv);
    const result = await parseCsv(file);

    expect(result.records).toHaveLength(2);
    expect(result.ambiguousRows.sort()).toEqual([2]); // Row 2 has two ambiguous dates
  });

  it("rejects CSV with missing required header", async () => {
    const csv = `EmpID,ProjectID,DateFrom
1,100,2023-01-01`;

    const file = createFile(csv);

    await expect(parseCsv(file)).rejects.toThrow(
      "Missing required header(s): DateTo",
    );
  });

  it("rejects CSV with no headers", async () => {
    const csv = `1,100,2023-01-01,2023-01-31`;

    const file = createFile(csv);

    await expect(parseCsv(file)).rejects.toThrow(
      "Missing required header(s): EmpID, ProjectID, DateFrom, DateTo",
    );
  });

  it("rejects invalid EmpID", async () => {
    const csv = `EmpID,ProjectID,DateFrom,DateTo
abc,100,2023-01-01,2023-01-31`;

    const file = createFile(csv);

    await expect(parseCsv(file)).rejects.toThrow(
      "Invalid EmpID or ProjectID at row 2",
    );
  });

  it("rejects invalid ProjectID", async () => {
    const csv = `EmpID,ProjectID,DateFrom,DateTo
1,abc,2023-01-01,2023-01-31`;

    const file = createFile(csv);

    await expect(parseCsv(file)).rejects.toThrow(
      "Invalid EmpID or ProjectID at row 2",
    );
  });

  it("rejects missing DateFrom", async () => {
    const csv = `EmpID,ProjectID,DateFrom,DateTo
1,100,,2023-01-31`;

    const file = createFile(csv);

    await expect(parseCsv(file)).rejects.toThrow(
      "DateFrom is required at row 2",
    );
  });

  it("rejects missing DateTo", async () => {
    const csv = `EmpID,ProjectID,DateFrom,DateTo
1,100,2023-01-01,`;

    const file = createFile(csv);

    await expect(parseCsv(file)).rejects.toThrow("DateTo is required at row 2");
  });

  it("rejects invalid DateFrom format", async () => {
    const csv = `EmpID,ProjectID,DateFrom,DateTo
1,100,invalid-date,2023-01-31`;

    const file = createFile(csv);

    await expect(parseCsv(file)).rejects.toThrow(
      'Invalid DateFrom at row 2: "invalid-date"',
    );
  });

  it("rejects invalid DateTo format", async () => {
    const csv = `EmpID,ProjectID,DateFrom,DateTo
1,100,2023-01-01,invalid-date`;

    const file = createFile(csv);

    await expect(parseCsv(file)).rejects.toThrow(
      'Invalid DateTo at row 2: "invalid-date"',
    );
  });

  it("accepts flexible date formats", async () => {
    const csv = `EmpID,ProjectID,DateFrom,DateTo
1,100,01/15/2023,2023-01-31`;

    const file = createFile(csv);
    const result = await parseCsv(file);

    expect(result.records).toHaveLength(1);
    expect(result.records[0].dateFrom.getDate()).toBe(15);
  });

  it("accepts NULL as DateTo", async () => {
    const csv = `EmpID,ProjectID,DateFrom,DateTo
1,100,2023-01-01,NULL`;

    const file = createFile(csv);
    const result = await parseCsv(file);

    expect(result.records).toHaveLength(1);
    expect(result.records[0].dateTo).toEqual(expect.any(Date));
  });

  it("skips empty lines", async () => {
    const csv = `EmpID,ProjectID,DateFrom,DateTo
1,100,2023-01-01,2023-01-31

2,100,2023-01-15,2023-02-15`;

    const file = createFile(csv);
    const result = await parseCsv(file);

    expect(result.records).toHaveLength(2);
  });

  it("parses multiple rows correctly", async () => {
    const csv = `EmpID,ProjectID,DateFrom,DateTo
1,100,2023-01-01,2023-01-31
2,200,2023-02-01,2023-02-28
3,100,2023-01-15,2023-02-15`;

    const file = createFile(csv);
    const result = await parseCsv(file);

    expect(result.records).toHaveLength(3);
    expect(result.records[1].empId).toBe(2);
    expect(result.records[1].projectId).toBe(200);
  });

  it("rejects empty CSV file", async () => {
    const csv = ``;

    const file = createFile(csv);

    await expect(parseCsv(file)).rejects.toThrow(
      "Missing required header(s): EmpID, ProjectID, DateFrom, DateTo",
    );
  });
});
