import { atom } from "recoil";

export interface UserToken {
  token?: string;
  refreshToken?: string;
}

export interface UserState extends UserToken {}

export const userStore = atom<UserState>({
  key: "user-store",
  default: {
    token: undefined,
    refreshToken: undefined,
  },
});

export default userStore;
