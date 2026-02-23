# React + TypeScript + Vite

# Employees Project

## Overview

This project processes employee CSV data to analyze overlapping work periods and project assignments. It features a modern React UI, robust CSV validation, and flexible date parsing.

## Features

- Upload CSV files with employee records
- Flexible date format support (US, EU, ISO)
- Ambiguity detection for date fields
- Validation for required headers and data types
- Results table showing employee pairs with maximum overlap
- Error handling and informative feedback

## Folder Structure

- `src/` – Main source code
  - `components/` – UI components
  - `context/` – React context for state management
  - `layout/` – Layout components
  - `pages/` – Page views
  - `router/` – App routing
  - `types/` – TypeScript types
  - `utils/` – Utility functions (CSV parsing, date handling)
- `sample-data/` – Example CSV files for testing
- `public/` – Static assets

## Getting Started

1. **Install dependencies:**

```
npm install
```

2. **Run the app:**

```
npm start
```

3. **Run tests:**

```
npm test
```

4. **Check code coverage:**

```
npm test -- --coverage
```

## Usage

- Navigate to the upload page and select a CSV file.
- Review parsed records and ambiguous dates.
- View results for employee pairs with maximum overlapping project periods.

## CSV Requirements

- Required headers: `EmpID`, `ProjectID`, `DateFrom`, `DateTo`
- Supports multiple date formats
- Handles missing or invalid data gracefully

## Technologies

- React
- TypeScript
- Vite
- Jest (testing)
- date-fns (date parsing)
- papaparse (CSV parsing)

## Employee Pair Calculation Logic

The core logic for finding employee pairs with maximum overlapping work periods is implemented in `src/utils/calculatePairs.ts`:

- **Grouping by Project:**
  - Employee records are grouped by `projectId` using a Map for efficient access.
- **Pairwise Comparison:**
  - For each project, every unique pair of employees is compared to calculate their overlapping days.
  - Overlap is computed using the maximum start date and minimum end date for each pair.
- **Optimizations for Large Data:**
  - Grouping records by project reduces unnecessary comparisons across unrelated projects.
  - Only pairs within the same project are checked, minimizing the number of comparisons.
  - The algorithm avoids redundant pair checks by iterating with `i` and `j` (where `j > i`).
  - Uses efficient date-fns functions for date calculations.
- **Finding Maximum Pair:**
  - After all pairs are calculated, results can be filtered to find the pair(s) with the highest overlap.
