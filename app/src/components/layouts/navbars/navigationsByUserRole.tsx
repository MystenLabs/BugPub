import React from "react";
import {
  CheckCircledIcon,
  CountdownTimerIcon,
  HomeIcon,
  LightningBoltIcon,
  PaperPlaneIcon,
} from "@radix-ui/react-icons";
import { NavigationLink } from "@/types/NavigationLink";
import { USER_ROLES } from "@/constants/USER_ROLES";

const authenticatedNavigations: NavigationLink[] = [
  {
    title: "Transfer SUI",
    href: "/transfer",
    icon: <PaperPlaneIcon />,
  },
  {
    title: "Test Transaction",
    href: "/test",
    icon: <PaperPlaneIcon />,
  },
];

const bountyOwnerNavigations: NavigationLink[] = [
  {
    title: "Send Audit NFT",
    href: "/bountyOwner/ownedBounties",
    icon: <LightningBoltIcon />,
  },
  {
    title: "Reward Pool",
    href: "/bountyOwner/topUp",
    icon: <LightningBoltIcon />,
  },
  {
    title: "Pay Auditors",
    href: "/bountyOwner/reward",
    icon: <LightningBoltIcon />,
  },
];

const globalNavigations: NavigationLink[] = [];

const userNavigations: NavigationLink[] = [
  {
    title: "Audits",
    href: "/user/audits",
    icon: <HomeIcon />,
  },
  {
    title: "Owned PoAs",
    href: "/user/ownedPoas",
    icon: <HomeIcon />,
  },
];

export const navigationsByUserRole = {
  anonymous: [
    {
      title: "Home",
      href: "/",
      icon: <HomeIcon />,
    },
    ...globalNavigations,
  ],
  member: [
    {
      title: "Home",
      href: `/${USER_ROLES.ROLE_3}`,
      icon: <HomeIcon />,
    },
    ...authenticatedNavigations,
    ...globalNavigations,
  ],
  moderator: [
    {
      title: "Home",
      href: `/${USER_ROLES.ROLE_2}`,
      icon: <HomeIcon />,
    },
    ...authenticatedNavigations,
    ...globalNavigations,
  ],
  admin: [
    {
      title: "Home",
      href: `/${USER_ROLES.ROLE_1}`,
      icon: <HomeIcon />,
    },
    ...authenticatedNavigations,
    ...globalNavigations,
  ],
  bountyOwner: [
    {
      title: "Home",
      href: `/${USER_ROLES.ROLE_5}`,
      icon: <HomeIcon />,
    },
    ...bountyOwnerNavigations,
  ],
  user: [
    {
      title: "Home",
      href: `/${USER_ROLES.ROLE_6}`,
      icon: <HomeIcon />,
    },
    ...userNavigations,
  ],
};
