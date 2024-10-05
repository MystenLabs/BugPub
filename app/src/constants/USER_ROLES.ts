import { UserRole } from "../types/Authentication";

interface IUserRoles {
  ROLE_1: UserRole;
  ROLE_2: UserRole;
  ROLE_3: UserRole;
  ROLE_4: UserRole;
  ROLE_5: UserRole;
  ROLE_6: UserRole;
}

export const USER_ROLES: IUserRoles = {
  ROLE_1: "admin",
  ROLE_2: "moderator",
  ROLE_3: "member",
  ROLE_4: "anonymous",
  ROLE_5: "bountyOwner",
  ROLE_6: "user",
};
