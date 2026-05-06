export type UserPublic = {
  id: string;
  name: string;
  email: string;
};

export type UserProfile = UserPublic & {
  createdAt: string;
  updatedAt: string;
};

export type AuthLoginRequest = {
  email: string;
  password: string;
};

export type AuthLoginResponse = {
  user: UserPublic;
  token: string;
};

export type AuthRegisterRequest = {
  name: string;
  email: string;
  password: string;
};
