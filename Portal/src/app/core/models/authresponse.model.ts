import { User } from "./user.model";
import { UserRole } from "./userrole.model";

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
  expiresIn?: number;
  roles: UserRole[];
}