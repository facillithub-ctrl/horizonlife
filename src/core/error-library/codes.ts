export interface HzError {
  code: string;
  title: string;
  message: string;
  solution?: string;
}

export const HZ_ERRORS = {
  // --- AUTHENTICATION (001-099) ---
  AUTH_INVALID_LOGIN: {
    code: "HZ-AUTH_001",
    title: "Acesso Negado",
    message: "Credenciais incorretas. Verifique seu e-mail ou senha.",
    solution: "Tente novamente ou use a recuperação de senha.",
  },
  AUTH_USER_NOT_FOUND: {
    code: "HZ-AUTH_002",
    title: "Horizon ID Não Encontrado",
    message: "Não localizamos uma conta ativa com este e-mail.",
    solution: "Verifique a grafia ou crie uma nova conta.",
  },
  AUTH_WEAK_PASSWORD: {
    code: "HZ-AUTH_003",
    title: "Segurança Insuficiente",
    message: "A senha fornecida é muito fraca para os padrões do Horizon.",
    solution: "Use no mínimo 6 caracteres com letras e números.",
  },
  AUTH_EMAIL_CONFLICT: {
    code: "HZ-AUTH_004",
    title: "Identidade Duplicada",
    message: "Este e-mail já está registrado em outro Horizon ID.",
    solution: "Faça login ou use outro e-mail.",
  },
  AUTH_RATE_LIMIT: {
    code: "HZ-AUTH_005",
    title: "Sistema em Proteção",
    message: "Muitas tentativas consecutivas. Aguarde alguns instantes.",
    solution: "Aguarde 60 segundos antes de tentar novamente.",
  },

  // --- VALIDATION (100-199) ---
  VAL_INVALID_EMAIL: {
    code: "HZ-VAL_101",
    title: "Formato Inválido",
    message: "O endereço de e-mail digitado parece incorreto.",
    solution: "Verifique se há espaços ou erros de digitação.",
  },
  VAL_MISSING_FIELDS: {
    code: "HZ-VAL_102",
    title: "Dados Incompletos",
    message: "Todos os campos obrigatórios devem ser preenchidos.",
  },

  // --- NETWORK & SYSTEM (500-599) ---
  NET_DISCONNECTED: {
    code: "HZ-NET_501",
    title: "Sem Conexão",
    message: "Não foi possível conectar ao servidor central.",
    solution: "Verifique sua internet (Wi-Fi/4G).",
  },
  SYS_UNKNOWN: {
    code: "HZ-SYS_999",
    title: "Erro Desconhecido",
    message: "Ocorreu uma anomalia inesperada no sistema.",
    solution: "Tente novamente mais tarde.",
  },
};

// Helper para mapear erros do Supabase/Firebase para nosso padrão
export const mapErrorToHz = (rawError: any): HzError => {
  const msg = rawError?.message?.toLowerCase() || "";

  if (msg.includes("invalid login") || msg.includes("invalid password"))
    return HZ_ERRORS.AUTH_INVALID_LOGIN;
  if (msg.includes("user not found")) return HZ_ERRORS.AUTH_USER_NOT_FOUND;
  if (msg.includes("email already in use") || msg.includes("unique constraint"))
    return HZ_ERRORS.AUTH_EMAIL_CONFLICT;
  if (msg.includes("weak password")) return HZ_ERRORS.AUTH_WEAK_PASSWORD;
  if (msg.includes("rate limit") || msg.includes("too many requests"))
    return HZ_ERRORS.AUTH_RATE_LIMIT;
  if (msg.includes("network")) return HZ_ERRORS.NET_DISCONNECTED;

  // Fallback com mensagem original se possível, mas mantendo código HZ
  return {
    ...HZ_ERRORS.SYS_UNKNOWN,
    message: rawError.message || HZ_ERRORS.SYS_UNKNOWN.message,
  };
};
