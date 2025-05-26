import "@testing-library/jest-dom";
import { render, waitFor } from "@testing-library/react";
import App from "../../src/App";

test("demo", () => {
  expect(true).toBe(true);
});

test("Renders the main page", async () => {
  render(<App />);
  await waitFor(() => {
    expect(true).toBeTruthy();
  });
});
