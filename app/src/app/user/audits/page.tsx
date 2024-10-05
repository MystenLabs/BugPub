"use client";

import React from "react";
import { Bounties } from "@/app/components/Bounties";

const UserAuditersPage = () => {
  return (
    <div className="flex flex-col mx-32 my-10">
      <h1>Audits</h1>
      <Bounties isDetailed={true} />
    </div>
  );
};

export default UserAuditersPage;
