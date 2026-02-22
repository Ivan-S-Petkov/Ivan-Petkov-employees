import { parse } from "papaparse";
import type { EmployeeRecord } from "../types/EmployeeRecord";
import { parseFlexibleDate } from "./dateUtils";

export interface ParseCsvResult {
  records: EmployeeRecord[];
  ambiguousRows: number[];
}

export function parseCsv(file: File): Promise<ParseCsvResult> {
  return new Promise((resolve, reject) => {
    parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        try {
          const headers = results.meta.fields;
          const required = ["EmpID", "ProjectID", "DateFrom", "DateTo"];

          if (!headers) {
            reject(new Error("CSV file has no header row."));
            return;
          }

          const missing = required.filter((h) => !headers.includes(h));
          if (missing.length > 0) {
            reject(
              new Error(`Missing required header(s): ${missing.join(", ")}`),
            );
            return;
          }

          const ambiguousRows = new Set<number>();
          const records: EmployeeRecord[] = (
            results.data as Record<string, string>[]
          ).map((row, index) => {
            const empId = Number(row.EmpID);
            const projectId = Number(row.ProjectID);

            if (isNaN(empId) || isNaN(projectId)) {
              throw new Error(`Invalid EmpID or ProjectID at row ${index + 2}`);
            }

            if (!row.DateFrom || String(row.DateFrom).trim() === "") {
              throw new Error(`DateFrom is required at row ${index + 2}`);
            }

            if (!row.DateTo || String(row.DateTo).trim() === "") {
              throw new Error(`DateTo is required at row ${index + 2}`);
            }

            let dateFrom, dateTo;
            try {
              const fromResult = parseFlexibleDate(row.DateFrom);
              dateFrom = fromResult.date;
              if (fromResult.isAmbiguous) ambiguousRows.add(index + 2);
            } catch {
              throw new Error(
                `Invalid DateFrom at row ${index + 2}: "${row.DateFrom}"`,
              );
            }

            try {
              const toResult = parseFlexibleDate(row.DateTo);
              dateTo = toResult.date;
              if (toResult.isAmbiguous) ambiguousRows.add(index + 2);
            } catch {
              throw new Error(
                `Invalid DateTo at row ${index + 2}: "${row.DateTo}"`,
              );
            }

            return { empId, projectId, dateFrom, dateTo };
          });

          resolve({ records, ambiguousRows: Array.from(ambiguousRows) });
        } catch (err) {
          reject(err);
        }
      },
      error: (err) => reject(err),
    });
  });
}
