import { screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import { AddRecord } from "@/components/AddRecord";
import { renderWithClient } from "@/test/utils";
import type { MetaSchema } from "@/features/types";

// мок API
vi.mock("@/features/api", () => ({
  createRecord: vi.fn(() => Promise.resolve({ ok: true })),
}));

const meta: MetaSchema = {
  location: { label: "Локация", type: "string", required: true },
  rack:     { label: "Номер стойки", type: "string", required: true, pattern: "^\\d+$" },
  email:    { label: "Email", type: "string", required: true, pattern: "^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$" },
};

describe("AddRecord form", () => {
  it("валидирует и вызывает createRecord", async () => {
    renderWithClient(<AddRecord meta={meta} />);

    fireEvent.click(screen.getByRole("button", { name: /добавить запись/i }));

    fireEvent.input(screen.getByPlaceholderText("Локация"), { target: { value: "СПб" } });
    fireEvent.input(screen.getByPlaceholderText("Номер стойки"), { target: { value: "42" } });
    fireEvent.input(screen.getByPlaceholderText("Email"), { target: { value: "test@example.com" } });

    fireEvent.click(screen.getByRole("button", { name: /^добавить$/i }));

    const { createRecord } = await import("@/features/api");
    await waitFor(() => expect(createRecord).toHaveBeenCalledTimes(1));

    expect(createRecord).toHaveBeenCalledWith({
      location: "СПб",
      rack: "42",
      email: "test@example.com",
    });
  });
});
