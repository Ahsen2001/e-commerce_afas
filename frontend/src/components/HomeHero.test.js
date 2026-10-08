import { act, fireEvent, render, screen } from "@testing-library/react";
import HomeHero from "./HomeHero";

const mockNavigate = jest.fn();
// CRA's Jest resolver predates React Router's package exports.
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}), { virtual: true });

let setVisibility;
let disconnect;
const originalObserver = global.IntersectionObserver;

beforeEach(() => {
  jest.useFakeTimers();
  mockNavigate.mockClear();
  disconnect = jest.fn();
  global.IntersectionObserver = jest.fn((callback) => {
    setVisibility = (visible) => callback([{ isIntersecting: visible }]);
    return { observe: jest.fn(), disconnect };
  });
});

afterEach(() => {
  jest.useRealTimers();
  global.IntersectionObserver = originalObserver;
});

test("rotates only while visible and releases the timer on unmount", () => {
  const { unmount } = render(<HomeHero />);
  expect(screen.getByText("Sigiriya Rock Fortress", { selector: "p" })).toBeTruthy();
  act(() => jest.advanceTimersByTime(4500));
  expect(screen.getByText("Nine Arch Bridge", { selector: "p" })).toBeTruthy();
  act(() => {
    setVisibility(false);
    jest.advanceTimersByTime(9000);
  });
  expect(screen.getByText("Nine Arch Bridge", { selector: "p" })).toBeTruthy();
  act(() => {
    setVisibility(true);
    jest.advanceTimersByTime(4500);
  });
  expect(screen.getByText("Unawatuna Beach", { selector: "p" })).toBeTruthy();
  unmount();
  expect(disconnect).toHaveBeenCalledTimes(1);
  expect(jest.getTimerCount()).toBe(0);
});

test("keeps homepage search navigation working", () => {
  render(<HomeHero />);
  const search = screen.getByPlaceholderText("Search destinations or products...");
  fireEvent.change(search, { target: { value: "Sigiriya" } });
  fireEvent.keyDown(search, { key: "Enter" });
  expect(mockNavigate).toHaveBeenCalledWith("/search/Sigiriya");
});
