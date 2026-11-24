import { act, render, screen, waitFor } from "@testing-library/react";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

const mocks = vi.hoisted(() => ({
  getSupabaseClient: vi.fn(),
  getSession: vi.fn(),
  onAuthStateChange: vi.fn(),
  from: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  getSupabaseClient: mocks.getSupabaseClient,
}));

function AuthStatus({ route = "início" }: { route?: string }) {
  const { user, loading } = useAuth();
  if (loading) return <p>preparando</p>;
  return <p>{user ? `autenticado:${route}` : "login"}</p>;
}

describe("Supabase session initialization", () => {
  let emitAuthEvent: ((event: AuthChangeEvent, session: Session | null) => void) | null;

  beforeEach(() => {
    emitAuthEvent = null;
    mocks.getSession.mockReset();
    mocks.onAuthStateChange.mockReset();
    mocks.from.mockReset();
    mocks.getSupabaseClient.mockReset();

    mocks.onAuthStateChange.mockImplementation(
      (callback: (event: AuthChangeEvent, session: Session | null) => void) => {
        emitAuthEvent = callback;
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      },
    );
    mocks.from.mockImplementation(() => {
      const query = {
        upsert: vi.fn().mockResolvedValue({ error: null }),
        select: vi.fn(),
        eq: vi.fn(),
        limit: vi.fn(),
        maybeSingle: vi.fn().mockResolvedValue({ data: { id: "workspace-1" }, error: null }),
      };
      query.select.mockReturnValue(query);
      query.eq.mockReturnValue(query);
      query.limit.mockReturnValue(query);
      return query;
    });
    mocks.getSupabaseClient.mockReturnValue({
      auth: {
        getSession: mocks.getSession,
        onAuthStateChange: mocks.onAuthStateChange,
      },
      from: mocks.from,
    });
  });

  it("waits for the initial auth event and does not let a stale null snapshot clear a valid session", async () => {
    let resolveSession!: (result: { data: { session: Session | null }; error: null }) => void;
    const pendingSession = new Promise<{ data: { session: Session | null }; error: null }>(
      (resolve) => {
        resolveSession = resolve;
      },
    );
    mocks.getSession.mockReturnValue(pendingSession);
    const user = {
      id: "user-1",
      email: "creative@example.test",
      user_metadata: {},
    } as User;
    const session = { user } as Session;

    const view = render(
      <AuthProvider>
        <AuthStatus />
      </AuthProvider>,
    );
    expect(screen.getByText("preparando")).toBeInTheDocument();
    expect(screen.queryByText("login")).not.toBeInTheDocument();

    await act(async () => {
      emitAuthEvent?.("INITIAL_SESSION", session);
    });
    await waitFor(() => expect(screen.getByText("autenticado:início")).toBeInTheDocument());

    await act(async () => {
      resolveSession({ data: { session: null }, error: null });
      await pendingSession;
    });
    expect(screen.getByText("autenticado:início")).toBeInTheDocument();

    view.rerender(
      <AuthProvider>
        <AuthStatus route="projetos" />
      </AuthProvider>,
    );
    expect(screen.getByText("autenticado:projetos")).toBeInTheDocument();
    expect(mocks.getSession).toHaveBeenCalledTimes(1);

    act(() => emitAuthEvent?.("SIGNED_OUT", null));
    await waitFor(() => expect(screen.getByText("login")).toBeInTheDocument());
    act(() => emitAuthEvent?.("SIGNED_IN", session));
    await waitFor(() => expect(screen.getByText("autenticado:projetos")).toBeInTheDocument());
  });

  it("shows login only after confirming the initial session is empty", async () => {
    mocks.getSession.mockResolvedValue({ data: { session: null }, error: null });
    render(
      <AuthProvider>
        <AuthStatus />
      </AuthProvider>,
    );

    await waitFor(() => expect(emitAuthEvent).toBeTypeOf("function"));
    expect(screen.getByText("preparando")).toBeInTheDocument();
    act(() => emitAuthEvent?.("INITIAL_SESSION", null));
    await waitFor(() => expect(screen.getByText("login")).toBeInTheDocument());
  });
});
