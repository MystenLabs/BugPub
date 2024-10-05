import { useCallback, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  AuthenticationContextProps,
  UserProps,
  UserRole,
} from "@/app/types/Authentication";
import { createContext } from "react";
import { ChildrenProps } from "@/app/types/ChildrenProps";
import { isFollowingUserPropsSchema } from "@/app/helpers/isFollowingUserPropsSchema";

export const anonymousUser: UserProps = {
  firstName: "",
  lastName: "",
  role: "anonymous",
  email: "",
  picture: "",
};

export const useAuthentication = () => {
  const context = useContext(AuthenticationContext);
  return context;
};

export const AuthenticationContext = createContext<AuthenticationContextProps>({
  user: anonymousUser,
  isLoading: false,
  setIsLoading: () => {},
  handleLoginAs: () => {},
  handleLogout: () => {},
});

export const AuthenticationProvider = ({ children }: ChildrenProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<UserProps>(anonymousUser);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLoginAs = useCallback(
    (userRole: UserRole) => {
      let newUser: UserProps = {
        firstName: "Web3",
        lastName: "User",
        role: userRole,
        email: "web3+user@example.com",
        picture: "",
      };
      console.log("handleLoginAs newUser", newUser);
      setUser(newUser);
      sessionStorage.setItem("user", JSON.stringify(newUser));
      const existingUserRole = sessionStorage.getItem("userRole");
      if (!existingUserRole) {
        sessionStorage.setItem("userRole", newUser.role);
      }
      if (pathname === "/" || pathname === "/auth") {
        if (newUser.role === "anonymous" || !newUser.role) {
          console.log(
            "pushing to / because newUser.role is anonymous or empty",
          );
          console.log("newUser.role", newUser.role);
          router.push(`/`);
        } else {
          router.push(`/${newUser.role}`);
        }
      }
    },
    [router, pathname],
  );

  useEffect(() => {
    const initialUser = sessionStorage.getItem("user");
    if (initialUser) {
      const parsedUser = JSON.parse(initialUser);
      if (!isFollowingUserPropsSchema(parsedUser)) {
        console.log("parsedUser", parsedUser);
        setUser(anonymousUser);
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("userRole");
        router.push("/");
      } else {
        const role = parsedUser.role;
        handleLoginAs(role);
      }
    } else {
      console.log("anonymousUser", anonymousUser);
      setUser(anonymousUser);
    }
    setIsLoading(false);
  }, [handleLoginAs, router]);

  const handleLogout = () => {
    setUser(anonymousUser);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("userRole");
    router.push("/");
  };

  return (
    <AuthenticationContext.Provider
      value={{
        user,
        isLoading,
        setIsLoading,
        handleLoginAs,
        handleLogout,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
