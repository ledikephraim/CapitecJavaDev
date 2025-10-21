import { UserRole } from "./userrole.model";

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  enabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
}