import { useRecoilState } from "recoil";

import { axiosInstance } from "../services/provider";
import userStore, { type UserToken } from "../store/user/atom";

interface LoginPayload {
  email: string;
  password: string;
}

const useUser = () => {
  const [user, setUser] = useRecoilState(userStore);

  const login = async ({ email, password }: LoginPayload) => {
    try {
      const { data } = await axiosInstance.post<UserToken>("/auth/login", {
        email,
        password,
      });

      setUser((prev) => ({ ...prev, ...data }));
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser((prev) => ({ ...prev, token: undefined, refreshToken: undefined }));
  };

  const onRefreshToken = (newToken: UserToken) => {
    setUser((prev) => ({ ...prev, ...newToken }));
  };

  return [{ ...user }, { login, logout, onRefreshToken }] as const;
};

export default useUser;
