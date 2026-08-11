import HomePage from "../pages/HomePage";
import { describe, expect, it } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

function renderHomePage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("HomePage", () => {
  it("renders hero heading", () => {
    renderHomePage();

    expect(screen.getByText("Discover Our New Collection")).toBeInTheDocument();
  });

  it("renders products section", () => {
    renderHomePage();

    expect(screen.getByText("Our Products")).toBeInTheDocument();
  });
});
