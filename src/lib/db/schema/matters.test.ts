import { describe, it, expect } from "vitest";
import { getTableName } from "drizzle-orm";
import { matters, matterTeam, matterDeadlines, medicalTreatments, matterStatusEnum, feeTypeEnum, deadlineTypeEnum } from "./matters";

describe("matters schema", () => {
  it("exports matters table", () => { expect(matters).toBeDefined(); });
  it("has correct table name", () => { expect(getTableName(matters)).toBe("matters"); });
  it("exports matterTeam", () => { expect(getTableName(matterTeam)).toBe("matter_team"); });
  it("exports matterDeadlines", () => { expect(getTableName(matterDeadlines)).toBe("matter_deadlines"); });
  it("exports medicalTreatments", () => { expect(getTableName(medicalTreatments)).toBe("medical_treatments"); });
  it("exports enums", () => { expect(matterStatusEnum).toBeDefined(); expect(feeTypeEnum).toBeDefined(); expect(deadlineTypeEnum).toBeDefined(); });
});
