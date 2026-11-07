import { pageList } from "./pagination";

describe("pageList", () => {
  test("shows every page when there are few", () => {
    expect(pageList(1, 3)).toEqual([1, 2, 3]);
  });

  test("collapses skipped pages around the current one", () => {
    expect(pageList(7, 20)).toEqual([1, "…", 6, 7, 8, "…", 20]);
  });

  test("handles the first and last page", () => {
    expect(pageList(1, 10)).toEqual([1, 2, "…", 10]);
    expect(pageList(10, 10)).toEqual([1, "…", 9, 10]);
  });

  test("doesn't add a gap when only one page would be skipped next to an edge", () => {
    expect(pageList(3, 10)).toEqual([1, 2, 3, 4, "…", 10]);
  });
});
