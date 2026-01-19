import { supabase } from "@/core/config/supabase";
import { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;

  // Actions
  initialize: () => Promise<void>;
  signIn: (email: string, pass: string) => Promise<void>;

  // Assinatura atualizada para o Wizard Completo
  signUp: (
    email: string,
    pass: string,
    fullName: string,
    phone?: string,
    accountType?: string,
    enable2FA?: boolean,
  ) => Promise<{ error: any; data: any }>;

  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: false,
  initialized: false,

  // 1. Inicialização (Chamado no _layout ou index)
  initialize: async () => {
    // Verifica sessão atual
    const {
      data: { session },
    } = await supabase.auth.getSession();

    set({
      session,
      user: session?.user ?? null,
      initialized: true,
    });

    // Escuta mudanças de estado (Login, Logout, Token Refresh)
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null });
    });
  },

  // 2. Login
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

    // Sucesso
    set({
      user: data.user,
      session: data.session,
      loading: false,
    });
  },

  // 3. Cadastro (Wizard Support)
  signUp: async (email, password, fullName, phone, accountType, enable2FA) => {
    set({ loading: true });

    // Enviamos os dados extras dentro de 'options.data'
    // O Supabase guarda isso em 'raw_user_meta_data'
    // Nosso Trigger SQL vai ler isso e criar o perfil.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone,
          account_type: accountType || "individual",
          two_factor_enabled: enable2FA || false,
          // Avatar padrão pode ser definido aqui ou no SQL
          avatar_url: "",
        },
      },
    });

    set({ loading: false });
    return { data, error };
  },

  // 4. Logout
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },
}));
