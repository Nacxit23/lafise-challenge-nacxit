interface Auth {
  username: string;
  password: string;
}

interface AuthResponse {
  token: string;
  expiresIn: number;
  user: {
    id: number;
  };
}

interface UserProduct {
  type: string;
  id: string;
}

interface UserResponse {
  full_name: string;
  profile_photo: string;
  products: UserProduct[];
}

interface User {
  id: number;
  fullName: string;
  profilePhoto: string;
  products: UserProduct[];
}

interface AuthenticatedResponse {
  token: string;
  expiresIn: number;
  user: User;
}

export type { Auth, AuthResponse, AuthenticatedResponse, User, UserResponse, UserProduct };
