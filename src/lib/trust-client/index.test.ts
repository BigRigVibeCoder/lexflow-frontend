import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

vi.mock("@/lib/logger", () => ({ logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() } }));

const BASE = "http://test-trust:4000";
const server = setupServer(
  http.get(`${BASE}/api/trust/accounts`, () => HttpResponse.json({ data: [{ id: "1", bankName: "B", accountName: "A", accountType: "iolta", balance: "100.00", ledgerCount: 1, createdAt: "" }] })),
  http.get(`${BASE}/api/trust/accounts/1`, () => HttpResponse.json({ id: "1", bankName: "B", accountName: "A", accountType: "iolta", balance: "100.00", ledgerCount: 1, createdAt: "" })),
  http.post(`${BASE}/api/trust/accounts`, () => HttpResponse.json({ id: "2", bankName: "N", accountName: "N", accountType: "operating", balance: "0.00", createdAt: "" }, { status: 201 })),
  http.post(`${BASE}/api/trust/transactions/deposit`, () => HttpResponse.json({ entryId: "e1", trustAccountBalance: "200.00", clientLedgerBalance: "200.00", createdAt: "" }, { status: 201 })),
);

beforeEach(() => { server.listen({ onUnhandledRequest: "bypass" }); });
import { TrustClient } from "./index";

describe("TrustClient", () => {
  const client = new TrustClient(BASE, "test-key");

  it("lists accounts", async () => {
    const result = await client.listAccounts();
    expect(result.data).toHaveLength(1);
    expect(result.data[0].accountType).toBe("iolta");
  });

  it("gets account by id", async () => {
    const account = await client.getAccount("1");
    expect(account.id).toBe("1");
  });

  it("creates account", async () => {
    const account = await client.createAccount({ bankName: "N", accountNumber: "123", routingNumber: "123456789", accountName: "N", accountType: "operating" });
    expect(account.id).toBe("2");
  });

  it("records deposit", async () => {
    const result = await client.recordDeposit({ trustAccountId: "1", clientLedgerId: "l1", amount: "100.00", description: "test", payorName: "P", paymentMethod: "check", createdByName: "U" });
    expect(result.entryId).toBe("e1");
    expect(result.clientLedgerBalance).toBe("200.00");
  });
});

afterAll(() => { server.close(); });
