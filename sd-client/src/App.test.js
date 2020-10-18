import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("render home", () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Authorization Code flow/i);
  expect(linkElement).toBeInTheDocument();
});
