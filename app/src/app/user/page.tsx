"use client";

import React from "react";
import { Bounties } from "@/app/components/Bounties";

const UserPage = () => {
  console.log("UserPage");
  return (
    <div className="flex flex-col mx-32 my-10">
      <h1>Bounties</h1>
      <Bounties />
    </div>
  );
};

export default UserPage;
