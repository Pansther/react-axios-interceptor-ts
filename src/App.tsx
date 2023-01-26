import useUser from "./hooks/useUser";
import useInterceptor from "./hooks/useInterceptor";
import { axiosInstance } from "./services/provider";

import "./App.css";

function App() {
  useInterceptor();
  const [user, { login }] = useUser();

  const onFetch = async () => {
    await axiosInstance.get("/");
  };

  const onLogin = () => {
    try {
      login({
        email: "cake001@edv.co.th",
        password: "wehirelovelove",
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  const on401 = async () => {
    try {
      await axiosInstance.get("/401");
    } catch (error) {
      console.log("error on 401", error);
    }
  };

  const onRefresh = async () => {
    try {
      await axiosInstance.get("/test");
    } catch (error) {
      console.log("error on refresh", error);
    }
  };

  return (
    <div className="App">
      <div>{JSON.stringify(user)}</div>
      <button onClick={onFetch}>fetch</button>
      <button onClick={onLogin}>login</button>
      <button onClick={on401}>401</button>
      <button onClick={onRefresh}>refresh</button>
    </div>
  );
}

export default App;
