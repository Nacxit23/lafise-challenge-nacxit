interface Auth {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  expiresIn: number;
  user: {
    id: number;
  };
}

export type { Auth, AuthResponse };
