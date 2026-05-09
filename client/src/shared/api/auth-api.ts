import { http } from "./http";
import type {
  AuthLoginRequest,
  AuthLoginResponse,
  AuthRegisterRequest,
  UserProfile,
} from "./types";

export const authApi = {
  async login(payload: AuthLoginRequest): Promise<AuthLoginResponse> {
    const { data } = await http.post<AuthLoginResponse>("/auth/login", payload);
    return data;
  },
  async register(payload: AuthRegisterRequest): Promise<AuthLoginResponse> {
    const { data } = await http.post<AuthLoginResponse>(
      "/auth/register",
      payload,
    );
    return data;
  },
  async me(): Promise<UserProfile> {
    const { data } = await http.get<{ user: UserProfile }>("/auth/me");
    return data.user;
  },
};
