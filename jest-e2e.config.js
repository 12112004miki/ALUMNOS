import { createDefaultPreset } from "ts-jest";

/** @type {import('jest').Config} */
export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  transform: createDefaultPreset().transform,
  testMatch: ["**/tests/e2e/**/*.spec.ts"],
  extensionsToTreatAsEsm: [".ts"],
  clearMocks: true,
  verbose: true
};
