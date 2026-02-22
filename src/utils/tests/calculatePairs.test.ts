import { calculatePairs } from "../calculatePairs";
import type { EmployeeRecord } from "../../types/EmployeeRecord";

describe("calculatePairs", () => {
  it("returns empty array for empty records", () => {
    expect(calculatePairs([])).toEqual([]);
  });

  it("returns empty array when only one employee per project", () => {
    const records: EmployeeRecord[] = [
      {
        empId: 1,
        projectId: 100,
        dateFrom: new Date("2023-01-01"),
        dateTo: new Date("2023-01-31"),
      },
    ];

    expect(calculatePairs(records)).toEqual([]);
  });

  it("calculates overlap for two employees on same project", () => {
    const records: EmployeeRecord[] = [
      {
        empId: 1,
        projectId: 100,
        dateFrom: new Date("2023-01-01"),
        dateTo: new Date("2023-01-31"),
      },
      {
        empId: 2,
        projectId: 100,
        dateFrom: new Date("2023-01-15"),
        dateTo: new Date("2023-02-15"),
      },
    ];

    const result = calculatePairs(records);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      emp1: 1,
      emp2: 2,
      projectId: 100,
      daysWorked: 17,
    });
  });

  it("returns zero overlap when employees don't overlap", () => {
    const records: EmployeeRecord[] = [
      {
        empId: 1,
        projectId: 100,
        dateFrom: new Date("2023-01-01"),
        dateTo: new Date("2023-01-15"),
      },
      {
        empId: 2,
        projectId: 100,
        dateFrom: new Date("2023-01-16"),
        dateTo: new Date("2023-01-31"),
      },
    ];

    expect(calculatePairs(records)).toEqual([]);
  });

  it("handles multiple projects independently", () => {
    const records: EmployeeRecord[] = [
      {
        empId: 1,
        projectId: 100,
        dateFrom: new Date("2023-01-01"),
        dateTo: new Date("2023-01-31"),
      },
      {
        empId: 2,
        projectId: 100,
        dateFrom: new Date("2023-01-15"),
        dateTo: new Date("2023-02-15"),
      },
      {
        empId: 1,
        projectId: 200,
        dateFrom: new Date("2023-02-01"),
        dateTo: new Date("2023-02-28"),
      },
      {
        empId: 3,
        projectId: 200,
        dateFrom: new Date("2023-02-15"),
        dateTo: new Date("2023-03-15"),
      },
    ];

    const result = calculatePairs(records);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      emp1: 1,
      emp2: 2,
      projectId: 100,
      daysWorked: 17,
    });
    expect(result[1]).toEqual({
      emp1: 1,
      emp2: 3,
      projectId: 200,
      daysWorked: 14,
    });
  });

  it("handles three+ employees on same project", () => {
    const records: EmployeeRecord[] = [
      {
        empId: 1,
        projectId: 100,
        dateFrom: new Date("2023-01-01"),
        dateTo: new Date("2023-01-31"),
      },
      {
        empId: 2,
        projectId: 100,
        dateFrom: new Date("2023-01-15"),
        dateTo: new Date("2023-02-15"),
      },
      {
        empId: 3,
        projectId: 100,
        dateFrom: new Date("2023-01-20"),
        dateTo: new Date("2023-02-20"),
      },
    ];

    const result = calculatePairs(records);

    expect(result).toHaveLength(3); // 1-2, 1-3, 2-3
    expect(result.some((p) => p.emp1 === 1 && p.emp2 === 2)).toBe(true);
    expect(result.some((p) => p.emp1 === 1 && p.emp2 === 3)).toBe(true);
    expect(result.some((p) => p.emp1 === 2 && p.emp2 === 3)).toBe(true);
  });

  it("calculates exact overlap when dates match exactly", () => {
    const records: EmployeeRecord[] = [
      {
        empId: 1,
        projectId: 100,
        dateFrom: new Date("2023-01-01"),
        dateTo: new Date("2023-01-10"),
      },
      {
        empId: 2,
        projectId: 100,
        dateFrom: new Date("2023-01-01"),
        dateTo: new Date("2023-01-10"),
      },
    ];

    const result = calculatePairs(records);

    expect(result[0].daysWorked).toBe(10);
  });

  it("handles single day overlap", () => {
    const records: EmployeeRecord[] = [
      {
        empId: 1,
        projectId: 100,
        dateFrom: new Date("2023-01-01"),
        dateTo: new Date("2023-01-15"),
      },
      {
        empId: 2,
        projectId: 100,
        dateFrom: new Date("2023-01-15"),
        dateTo: new Date("2023-01-31"),
      },
    ];

    const result = calculatePairs(records);

    expect(result).toHaveLength(1);
    expect(result[0].daysWorked).toBe(1);
  });
});
