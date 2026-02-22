import { differenceInDays, max, min } from "date-fns";
import type { EmployeeRecord } from "../types/EmployeeRecord";
import type { PairResult } from "../types/PairResult";

export function calculatePairs(records: EmployeeRecord[]): PairResult[] {
  const results: PairResult[] = [];

  // 1. Group records by projectId
  const projectsMap = new Map<number, EmployeeRecord[]>();

  for (const rec of records) {
    if (!projectsMap.has(rec.projectId)) {
      projectsMap.set(rec.projectId, []);
    }
    projectsMap.get(rec.projectId)!.push(rec);
  }

  // 2. For each project, compare every pair of employees
  for (const [projectId, employees] of projectsMap.entries()) {
    for (let i = 0; i < employees.length; i++) {
      for (let j = i + 1; j < employees.length; j++) {
        const a = employees[i];
        const b = employees[j];

        // 3. Calculate overlap
        const overlap = calculateOverlapDays(
          a.dateFrom,
          a.dateTo,
          b.dateFrom,
          b.dateTo,
        );

        if (overlap > 0) {
          results.push({
            emp1: a.empId,
            emp2: b.empId,
            projectId,
            daysWorked: overlap,
          });
        }
      }
    }
  }

  return results;
}

function calculateOverlapDays(
  startA: Date,
  endA: Date,
  startB: Date,
  endB: Date,
): number {
  const overlapStart = max([startA, startB]);
  const overlapEnd = min([endA, endB]);

  if (overlapEnd < overlapStart) return 0;

  return differenceInDays(overlapEnd, overlapStart) + 1;
}
