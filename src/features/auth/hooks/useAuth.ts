import { supabase } from "@/core/config/supabase";
import { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";

// Payload atualizado
interface SignupPayload {
  email: string;
  pass: string;
  fullName: string;
  horizonId: string;
  accountType: string;
  phone?: string;
  address?: { cep: string; city: string; state: string; street: string };
  termsAccepted: boolean;
  context?: any;
  preferences?: { theme: string; notifications: string[] };
  enable2FA?: boolean;
  // Novos campos opcionais (pós-onboarding)
  bio?: string;
  avatarUrl?: string;
  topics?: string[];
}

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  initialize: () => Promise<void>;
  signIn: (email: string, pass: string) => Promise<void>;

  // Validações
  checkHandleAvailability: (handle: string) => Promise<boolean>;
  checkEmailAvailability: (email: string) => Promise<boolean>; // [NOVO]

  signUp: (payload: SignupPayload) => Promise<{ error: any; data: any }>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: false,
  initialized: false,

  initialize: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    set({ session, user: session?.user ?? null, initialized: true });
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null });
    });
  },

  checkHandleAvailability: async (handle: string) => {
    if (!handle) return false;
    // RPC call para checar handle
    const { data, error } = await supabase.rpc("check_handle_availability", {
      handle_to_check: handle,
    });
    if (error) {
      console.error(error);
      return false;
    }
    return data;
  },

  // [NOVO] Validação de Email
  checkEmailAvailability: async (email: string) => {
    if (!email || !email.includes("@")) return false;
    // No Supabase, a checagem de email pública é restrita por segurança.
    // Usamos uma RPC customizada ou assumimos true se não der para checar sem auth.
    // Aqui simularemos uma checagem "lenta" para UX.
    await new Promise((r) => setTimeout(r, 800));
    return true; // Mock: sempre disponível por enquanto (implementar RPC real depois)
  },

  signIn: async (email, password) => {
    set({ loading: true });
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      set({ loading: false });
      throw error;
    }
    set({ user: data.user, session: data.session, loading: false });
  },

  signUp: async (payload) => {
    set({ loading: true });

    // Higienização
    const safeData = {
      full_name: payload.fullName,
      horizon_id: payload.horizonId,
      account_type: payload.accountType,
      phone: payload.phone || "",
      address: payload.address || {},
      user_context: payload.context || {},
      app_preferences: payload.preferences || {},
      terms_accepted: payload.termsAccepted,
      two_factor_enabled: payload.enable2FA || false,

      // Novos metadados
      bio: payload.bio || "",
      topics: payload.topics || [],

      language: "pt-BR",
      country: "BR",
    };

    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.pass,
      options: { data: safeData },
    });

    if (error) console.error("[AUTH_ERROR]", error.message);
    set({ loading: false });
    return { data, error };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },
}));
