import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronDown, LucideSlash } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type BreadCrumbsProps = {
  breadcrumbs: {
    title: string;
    href?: string;
    dropdown?: {
      title: string;
      href: string;
    }[];
  }[];
};

const BreadCrumbs = ({ breadcrumbs }: BreadCrumbsProps) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => {
          let breadcrumbItem = (
            <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
          );

          if (breadcrumb.href) {
            breadcrumbItem = (
              <BreadcrumbLink asChild>
                <Link href={breadcrumb.href}>{breadcrumb.title}</Link>
              </BreadcrumbLink>
            );
          }
          if (breadcrumb.dropdown) {
            breadcrumbItem = (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  {breadcrumb.title}
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {breadcrumb.dropdown.map((item) => (
                    <DropdownMenuItem asChild key={item.href}>
                      <Link href={item.href}>{item.title}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          }

          return (
            <Fragment key={breadcrumb.title}>
              <BreadcrumbItem>{breadcrumbItem}</BreadcrumbItem>
              {index < breadcrumbs.length - 1 && (
                <BreadcrumbSeparator>
                  <LucideSlash />
                </BreadcrumbSeparator>
              )}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadCrumbs;
