export type TUser = {
  id: string;
  name: string;
  username: string;
  password: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type TUserCreate = {
  name: string;
  username: string;
  password: string;
  role?: string;
  isActive?: boolean;
}

export type TUserGetResponse = {
  id: string;
  name: string;
  username: string;
  role: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
};
