import { UserRole } from "../types/Authentication";

interface IUserRoles {
  ROLE_1: UserRole;
  ROLE_2: UserRole;
  ROLE_3: UserRole;
}

export const USER_ROLES: IUserRoles = {
  ROLE_1: "bountyOwner",
  ROLE_2: "user",
  ROLE_3: "moderator",
};
