import { supabase } from "@/core/config/supabase";
import { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";

// Definição Rigorosa do Payload
interface SignupPayload {
  email: string;
  pass: string;
  fullName: string;
  horizonId: string;
  accountType: string;

  // Opcionais
  phone?: string;
  address?: { cep: string; city: string; state: string; street: string };
  termsAccepted: boolean;
  context?: any;
  preferences?: { theme: string; notifications: string[] };
  enable2FA?: boolean;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;

  initialize: () => Promise<void>;
  signIn: (email: string, pass: string) => Promise<void>;
  checkHandleAvailability: (handle: string) => Promise<boolean>;

  // Função Única de Cadastro
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
    // Verifica na tabela PROFILES se o handle existe
    const { data, error } = await supabase
      .from("profiles")
      .select("horizon_id")
      .eq("horizon_id", handle.toLowerCase())
      .single();

    // Se retornar data, está ocupado (false). Se erro (row not found), livre (true).
    return !data;
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

    // LOG DE DEBUG: Verifique isso no terminal se der erro
    console.group("[AUTH_HOOK] Signup Payload");
    console.log(JSON.stringify(payload, null, 2));

    // 1. HIGIENIZAÇÃO DE DADOS
    // Remove undefineds que quebram o SQL
    const safeData = {
      full_name: payload.fullName,
      horizon_id: payload.horizonId,
      account_type: payload.accountType,
      phone: payload.phone || "", // Nunca undefined

      // Objetos JSON vazios se não preenchidos
      address: payload.address || {},
      user_context: payload.context || {},
      app_preferences: payload.preferences || {},

      terms_accepted: payload.termsAccepted,
      two_factor_enabled: payload.enable2FA || false,

      language: "pt-BR",
      country: "BR",
    };

    console.log("Sending to Supabase:", safeData);
    console.groupEnd();

    // 2. ENVIO
    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.pass,
      options: {
        data: safeData, // Isso vai para raw_user_meta_data
      },
    });

    if (error) {
      console.error("[AUTH_ERROR]", error.message);
    }

    set({ loading: false });
    return { data, error };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },
}));
