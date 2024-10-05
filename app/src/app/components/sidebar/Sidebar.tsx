"use client";

import { useState, useEffect } from "react";

import { Sidebar } from "flowbite-react";
import {
  HiArrowSmLeft,
  HiCake,
  HiChartPie,
  HiChartSquareBar,
  HiCurrencyDollar,
  HiStar,
  HiTrash,
  HiUser,
  HiPlus,
  HiMinus,
} from "react-icons/hi";
import { useAuthentication } from "@/contexts/Authentication";
import { HiRocketLaunch } from "react-icons/hi2";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "react-responsive";

export const MySidebar = () => {
  const pathname = usePathname();
  const { user, handleLogout } = useAuthentication();
  const isLargeScreen = useMediaQuery({ query: "(min-width: 768px)" });
  const [isOpen, setIsOpen] = useState(isLargeScreen);

  useEffect(() => {
    if (isLargeScreen) setIsOpen(true);
    else setIsOpen(false);
  }, [isLargeScreen]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className={`sidebar ${isOpen ? "expanded" : "collapsed"}`}>
      {pathname !== "/" && (
        <Sidebar aria-label="Sidebar" className={``}>
          <Sidebar.Items>
            {user.role === "bountyOwner" && (
              <Sidebar.ItemGroup>
                <Sidebar.Item href="/bountyOwner" icon={HiChartPie}>
                  Dashboard
                </Sidebar.Item>
                <Sidebar.Item
                  href="/bountyOwner/ownedBounties"
                  icon={HiUser}
                  label="Owner"
                  labelColor="dark"
                >
                  Auditor
                </Sidebar.Item>
                <Sidebar.Item
                  href="/bountyOwner/topUp"
                  icon={HiCurrencyDollar}
                  label="Owner"
                  labelColor="dark"
                >
                  Top Up
                </Sidebar.Item>
                <Sidebar.Item
                  href="/bountyOwner/reward"
                  icon={HiCake}
                  label="Owner"
                  labelColor="dark"
                >
                  Reward
                </Sidebar.Item>
              </Sidebar.ItemGroup>
            )}

            {user.role === "user" && (
              <Sidebar.ItemGroup>
                <Sidebar.Item href="/user" icon={HiChartPie}>
                  Top Audits
                </Sidebar.Item>
                <Sidebar.Item href="/user/audits" icon={HiChartSquareBar}>
                  Audits
                </Sidebar.Item>
                <Sidebar.Item href="/user/ownedPoas" icon={HiRocketLaunch}>
                  Recently Visited
                </Sidebar.Item>
              </Sidebar.ItemGroup>
            )}

            {user.role === "moderator" && (
              <Sidebar.ItemGroup>
                <Sidebar.Item href="/moderator" icon={HiStar}>
                  Bounties
                </Sidebar.Item>
                <Sidebar.Item
                  href="/moderator/add"
                  icon={HiPlus}
                  label="Admin"
                  labelColor="dark"
                >
                  Add
                </Sidebar.Item>
                <Sidebar.Item
                  href="/moderator/delete"
                  icon={HiMinus}
                  label="Owner"
                  labelColor="dark"
                >
                  Delete
                </Sidebar.Item>
              </Sidebar.ItemGroup>
            )}

            <Sidebar.ItemGroup>
              <Sidebar.Item onClick={handleLogout} icon={HiTrash}>
                Logout
              </Sidebar.Item>
              <Sidebar.Item onClick={toggleSidebar} icon={HiArrowSmLeft}>
                {isOpen ? "Hide" : "Show"}
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      )}
    </div>
  );
};
