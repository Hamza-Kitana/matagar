import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { App } from "@/App";

afterEach(() => {
  cleanup();
  window.history.pushState(null, "", "/");
});

describe("App", () => {
  it("renders every storefront section on the home page", () => {
    const { container } = render(<App />);

    for (const id of ["top", "statement", "collection", "about", "contact"]) {
      expect(container.querySelector(`#${id}`)).not.toBeNull();
    }
    expect(screen.getAllByRole("article")).toHaveLength(6);
  });

  it("lists six categories of ten products and filters them by search", () => {
    window.history.pushState(null, "", "/products");
    const { container } = render(<App />);

    expect(container.querySelectorAll(".catalog-section")).toHaveLength(6);
    expect(screen.getAllByRole("article")).toHaveLength(60);
    fireEvent.change(screen.getByRole("searchbox", { name: "دوّر على منتج" }), { target: { value: "سبيكر" } });
    expect(screen.getAllByRole("article").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("article").length).toBeLessThan(60);
  });

  it("opens a product page with selectable options and adds the chosen variant", () => {
    window.history.pushState(null, "", "/product/watch");
    render(<App />);

    expect(screen.getByRole("heading", { level: 1, name: "ساعة سمارت" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "فضي" }));
    fireEvent.click(screen.getByRole("button", { name: "45 ملم" }));
    expect(screen.getByRole("button", { name: "فضي" })).toHaveAttribute("aria-pressed", "true");

    act(() => { fireEvent.click(screen.getAllByRole("button", { name: /أضف للسلة/ })[0]!); });
    fireEvent.click(screen.getByRole("button", { name: /السلة، 1/ }));
    expect(within(screen.getByRole("dialog")).getByText(/فضي · 45 ملم · سيليكون رياضي/)).toBeInTheDocument();
  });

  it("opens every page from the header navigation", () => {
    render(<App />);
    const nav = screen.getByRole("navigation", { name: "التنقل الرئيسي" });
    const pages = [
      ["المنتجات", "كل القطع"],
      ["الخدمات", "خدمات بتخلّي"],
      ["من نحن", "بلّشنا من"],
      ["تواصل معنا", "عندك سؤال؟"],
    ] as const;
    for (const [link, heading] of pages) {
      fireEvent.click(within(nav).getByRole("link", { name: link }));
      expect(screen.getByRole("heading", { level: 1, name: new RegExp(heading) })).toBeInTheDocument();
      expect(within(nav).getByRole("link", { name: link })).toHaveAttribute("aria-current", "page");
    }
  });

  it("navigates from a product card link without reloading", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("link", { name: "صفحة سماعات وايرلس" }));
    expect(screen.getByRole("heading", { level: 1, name: "سماعات وايرلس" })).toBeInTheDocument();
  });
});
