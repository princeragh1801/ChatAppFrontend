import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, logoutUser, registerUser } from "../api";
import Loader from "../components/Loader";
import { UserInterface } from "../interfaces/user";
import { LocalStorage, requestHandler, ToastService } from "../utils";

// Create a context to manage authentication-related data and functions
const AuthContext = createContext<{
  user: UserInterface | null;
  token: string | null;
  login: (data: { username: string; password: string }) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    username: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}>({
  user: null,
  token: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

// Create a hook to access the AuthContext
const useAuth = () => useContext(AuthContext);

// Create a component that provides authentication-related data and functions
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<UserInterface | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const navigate = useNavigate();

  // Function to handle user login
  const login = async (data: { username: string; password: string }) => {
    await requestHandler(
      async () => await loginUser(data),
      
      setIsLoading,
      (res) => {
        console.log("Inside the login function")
        const { data } = res;
        console.log(res);
        console.log(data)
        setUser(data.user);
        setToken(data.token);
        LocalStorage.set("user", data.user);
        LocalStorage.set("token", data.token);
        navigate("/chat"); // Redirect to the chat page after successful login
      },
      (error) => {
        ToastService.error(error);
      } // Display error alerts on request failure
    );
  };

  // Function to handle user registration
  const register = async (data: {
    name: string;
    email: string;
    username: string;
    password: string;
  }) => {
    await requestHandler(
      async () => await registerUser(data),
      setIsLoading,
      () => {
        ToastService.success("Account created successfully! Go ahead and login.");
        navigate("/login"); // Redirect to the login page after successful registration
      },
      (error) => {
        ToastService.error(error);
      } // Display error alerts on request failure
    );
  };

  // Function to handle user logout
  const logout = async () => {
    await requestHandler(
      async () => await logoutUser(),
      setIsLoading,
      () => {
        setUser(null);
        setToken(null);
        LocalStorage.clear(); // Clear local storage on logout
        navigate("/login"); // Redirect to the login page after successful logout
      },
      (error) => {
        ToastService.error(error);
      } // Display error alerts on request failure
    );
  };

  // Check for saved user and token in local storage during component initialization
  useEffect(() => {
    setIsLoading(true);
    const _token = LocalStorage.get("token");
    console.log("Token from local storage : ", _token);
    const _user = LocalStorage.get("user");
    console.log("User from local storage : ", _user);
    if (_token && _user?.id) {
      console.log("Setting user and token from local storage");
      setUser(_user);
      setToken(_token);
    }
    setIsLoading(false);
  }, []);
  // Provide authentication-related data and functions through the context
  return (
    <AuthContext.Provider value={{ user, login, register, logout, token }}>
      {isLoading ? <Loader /> : children} {/* Display a loader while loading */}
    </AuthContext.Provider>
  );
};

// Export the context, provider component, and custom hook
export { AuthContext, AuthProvider, useAuth };
