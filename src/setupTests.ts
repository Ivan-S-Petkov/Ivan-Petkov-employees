import "@testing-library/jest-dom";

// Polyfill TextEncoder for MUI DataGrid tests
import { TextEncoder } from "util";
global.TextEncoder = TextEncoder;
