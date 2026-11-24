import { act, render, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useTheme } from "@/contexts/theme-context";
import { formatDashboardDate } from "@/lib/date-format";
import { Pricing } from "@/modules/Pricing";
import { MessageResponse } from "@/components/ai-elements/message";

function withTheme({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe("GAMBO presentation preferences", () => {
  it("restores and persists the selected theme across provider remounts", async () => {
    window.localStorage.setItem("gambo.theme", "clean");
    const first = renderHook(() => useTheme(), { wrapper: withTheme });

    await waitFor(() => {
      expect(first.result.current.theme).toBe("clean");
      expect(document.documentElement.dataset["theme"]).toBe("clean");
    });
    act(() => first.result.current.setTheme("dark"));
    await waitFor(() => {
      expect(document.documentElement.dataset["theme"]).toBe("dark");
      expect(window.localStorage.getItem("gambo.theme")).toBe("dark");
    });

    first.unmount();
    const next = renderHook(() => useTheme(), { wrapper: withTheme });
    await waitFor(() => expect(next.result.current.theme).toBe("dark"));
  });
});

describe("demonstrative pricing", () => {
  it("shows three fictitious plans with disabled actions and a clear commercial disclaimer", () => {
    const { container } = render(<Pricing />);
    const renderedText = container.textContent ?? "";

    expect(renderedText).toContain("GAMBO Starter");
    expect(renderedText).toContain("GAMBO Studio");
    expect(renderedText).toContain("GAMBO Agency");
    expect(renderedText).toContain("29,90");
    expect(renderedText).toContain("59,90");
    expect(renderedText).toContain("99,90");
    expect(renderedText).toContain(
      "Valores e funcionalidades apresentados apenas para fins demonstrativos. Os planos comerciais ainda não estão disponíveis.",
    );
    const buttons = Array.from(container.querySelectorAll("button"));
    expect(buttons).toHaveLength(3);
    expect(buttons.every((button) => button.disabled)).toBe(true);
  });
});

describe("dashboard date", () => {
  it("formats the current local date in Portuguese without a fixed date", () => {
    expect(formatDashboardDate(new Date(2026, 10, 22, 12))).toBe("DOMINGO, 22 NOV 2026");
  });
});

describe("IA Director rich-text response", () => {
  it("renders markdown and decodes entities without rendering arbitrary HTML", async () => {
    const { container } = render(
      <MessageResponse>
        {
          "**Direção** &#x20; *visual*\n\n- luz suave &amp; sombra\n\nLiteral: \\*\n\n<script>alert(1)</script>"
        }
      </MessageResponse>,
    );

    await waitFor(() =>
      expect(container.querySelector('[data-streamdown="strong"]')).toHaveTextContent("Direção"),
    );
    expect(container.textContent).not.toContain("&#x20;");
    expect(container.textContent).not.toContain("&amp;");
    expect(container.textContent).toContain("luz suave & sombra");
    expect(container.textContent).not.toContain("\\*");
    expect(container.querySelector("script")).toBeNull();
  });
});
