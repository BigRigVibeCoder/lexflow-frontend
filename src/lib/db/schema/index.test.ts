import { describe, it, expect } from "vitest";
import { users, sessions, auditLogs, clients, matters, matterTeam, matterDeadlines, medicalTreatments, contacts, matterContacts } from "./index";

describe("schema barrel exports", () => {
  it("exports users", () => { expect(users).toBeDefined(); });
  it("exports sessions", () => { expect(sessions).toBeDefined(); });
  it("exports auditLogs", () => { expect(auditLogs).toBeDefined(); });
  it("exports clients", () => { expect(clients).toBeDefined(); });
  it("exports matters", () => { expect(matters).toBeDefined(); });
  it("exports matterTeam", () => { expect(matterTeam).toBeDefined(); });
  it("exports matterDeadlines", () => { expect(matterDeadlines).toBeDefined(); });
  it("exports medicalTreatments", () => { expect(medicalTreatments).toBeDefined(); });
  it("exports contacts", () => { expect(contacts).toBeDefined(); });
  it("exports matterContacts", () => { expect(matterContacts).toBeDefined(); });
});
