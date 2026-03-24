import { describe, it, expect } from "vitest";
import { getTableName } from "drizzle-orm";
import { contacts, matterContacts, contactTypeEnum } from "./contacts";

describe("contacts schema", () => {
  it("exports contacts table", () => { expect(contacts).toBeDefined(); });
  it("has correct table name", () => { expect(getTableName(contacts)).toBe("contacts"); });
  it("exports matterContacts", () => { expect(getTableName(matterContacts)).toBe("matter_contacts"); });
  it("exports contactTypeEnum", () => { expect(contactTypeEnum).toBeDefined(); });
});
