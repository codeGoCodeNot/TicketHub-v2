import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SignOutItem from "@/features/auth/components/sign-out-item";
import {
  accountPasswordPagePath,
  accountProfilePagePath,
  pricePagePath,
} from "@/path";
import { User } from "better-auth/types";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LucideGem, LucideLock, LucideUser } from "lucide-react";

type AccountDropdownProps = {
  user: User;
};

const AccountDropdown = ({ user }: AccountDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Avatar>
          <AvatarImage
            src={user.image ?? undefined}
            alt={user.name || "User Avatar"}
          />
          <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        sideOffset={8}
        collisionPadding={12}
        className="w-56 rounded-md"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="truncate">
            {user.email}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={accountProfilePagePath()}>
              <LucideUser />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={accountPasswordPagePath()}>
              <LucideLock />
              <span>Password</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {/* Pricing */}
        <DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={pricePagePath()}>
              <LucideGem />
              <span>Pricing</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {/* Sign out */}
        <DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <SignOutItem />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AccountDropdown;
