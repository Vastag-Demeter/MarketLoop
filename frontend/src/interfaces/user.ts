export interface Role {
  id: string;
  name: string;
  is_active: boolean | null;
  key: string | null;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: Role[];
  active: boolean | null;
}
