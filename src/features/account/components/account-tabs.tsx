"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { accountProfilePagePath, accountPasswordPagePath } from "@/path";
import { LucideUser, LucideLock } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AccountTabs = () => {
  const pathname = usePathname();

  return (
    <Tabs value={pathname.split("/").at(-1)}>
      <TabsList>
        <TabsTrigger value="profile" asChild>
          <Link href={accountProfilePagePath()}>
            <LucideUser />
            Profile
          </Link>
        </TabsTrigger>
        <TabsTrigger value="password" asChild>
          <Link href={accountPasswordPagePath()}>
            <LucideLock />
            Password
          </Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default AccountTabs;
