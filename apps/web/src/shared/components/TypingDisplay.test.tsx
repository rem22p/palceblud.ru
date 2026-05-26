import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { TypingDisplay } from "./TypingDisplay";

describe("TypingDisplay", () => {
  it("renders all characters", () => {
    const { container } = render(
      <TypingDisplay text="hello world" currentIndex={0} errors={[]} />,
    );
    expect(container.textContent).toBe("hello world");
  });

  it("highlights correct characters in green", () => {
    const { container } = render(
      <TypingDisplay text="hi" currentIndex={1} errors={[]} />,
    );
    // Find character spans inside word wrapper
    const wordWrapper = container.querySelector("[data-word]")!;
    const charSpans = wordWrapper.querySelectorAll("span");
    expect(charSpans[0].className).toContain("text-green");
  });

  it("highlights incorrect characters in red", () => {
    const { container } = render(
      <TypingDisplay text="hi" currentIndex={1} errors={[0]} />,
    );
    const wordWrapper = container.querySelector("[data-word]")!;
    const charSpans = wordWrapper.querySelectorAll("span");
    expect(charSpans[0].className).toContain("text-red");
  });

  it("shows caret at current position", () => {
    const { container } = render(
      <TypingDisplay text="abc" currentIndex={1} errors={[]} />,
    );
    const caret = container.querySelector(".bg-accent");
    expect(caret).toBeTruthy();
  });

  it("wraps words in inline-block to prevent mid-word breaks", () => {
    const { container } = render(
      <TypingDisplay text="hello beautiful world" currentIndex={0} errors={[]} />,
    );
    // Only count word wrappers (not spaces)
    const wordWrappers = container.querySelectorAll("[data-word]");
    expect(wordWrappers.length).toBe(3);

    for (const wrapper of wordWrappers) {
      const style = window.getComputedStyle(wrapper as HTMLElement);
      expect(style.display).toBe("inline-block");
      expect(style.whiteSpace).toBe("nowrap");
    }
  });

  it("preserves spaces between words", () => {
    const { container } = render(
      <TypingDisplay text="a b" currentIndex={0} errors={[]} />,
    );
    // Should have a space element between words
    const spaces = container.querySelectorAll("[data-space]");
    expect(spaces.length).toBeGreaterThan(0);
    expect(container.textContent).toBe("a b");
  });
});
