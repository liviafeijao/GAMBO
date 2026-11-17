import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/supabase";

type AuthResult = {
  error: string | null;
  needsEmailConfirmation?: boolean;
};

type AuthContextValue = {
  user: User | null;
  workspaceId: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (name: string, email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function prepareUserWorkspace(user: User): Promise<string> {
  const supabase = getSupabaseClient();
  const fullName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : user.email?.split("@")[0] ?? "Pessoa usuária";

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: user.id,
    full_name: fullName,
  });
  if (profileError) throw profileError;

  const { data: workspace, error: workspaceError } = await supabase
    .from("workspaces")
    .select("id")
    .eq("owner_id", user.id)
    .limit(1)
    .maybeSingle();
  if (workspaceError) throw workspaceError;
  if (workspace?.id) return workspace.id as string;

  const { data: createdWorkspace, error: createWorkspaceError } = await supabase
    .from("workspaces")
    .insert({ owner_id: user.id, name: "Meu estúdio" })
    .select("id")
    .single();
  if (createWorkspaceError) throw createWorkspaceError;
  return createdWorkspace.id as string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const supabase = getSupabaseClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (error) throw error;
        if (active) {
          const sessionUser = data.session?.user ?? null;
          setUser(sessionUser);
          if (!sessionUser) setLoading(false);
        }
      })
      .catch((error: unknown) => {
        console.error("Falha ao recuperar sessão do GAMBO:", error);
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let active = true;
    if (!user) {
      setWorkspaceId(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    prepareUserWorkspace(user)
      .then((id) => {
        if (active) setWorkspaceId(id);
      })
      .catch((error: unknown) => {
        console.error("Não foi possível preparar o workspace:", error);
        if (active) setWorkspaceId(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user]);

  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      const { error } = await getSupabaseClient().auth.signInWithPassword({
        email,
        password,
      });
      return { error: error?.message ?? null };
    },
    [],
  );

  const signUp = useCallback(
    async (name: string, email: string, password: string): Promise<AuthResult> => {
      const { data, error } = await getSupabaseClient().auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (error) return { error: error.message };
      return { error: null, needsEmailConfirmation: !data.session };
    },
    [],
  );

  const signOut = useCallback(async () => {
    const { error } = await getSupabaseClient().auth.signOut({ scope: "local" });
    if (error) throw error;
    setUser(null);
    setWorkspaceId(null);
  }, []);

  const value = useMemo(
    () => ({ user, workspaceId, loading, signIn, signUp, signOut }),
    [user, workspaceId, loading, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth precisa ser usado dentro de AuthProvider.");
  return context;
}
