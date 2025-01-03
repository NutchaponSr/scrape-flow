"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";

import { Logo } from "@/components/logo";

import { routes } from "@/constants/routes";

export const Sidebar = () => {
  const pathname = usePathname();
  const activeRoute = routes.find((route) => route.href.length > 0 && pathname.includes(route.href)) || routes[0];

  return (
    <div className="hidden relative md:block min-w-[280px] max-w-[280px] h-screen overflow-hidden w-full bg-primary/5 dark:bg-secondary/30 dark:text-foreground text-muted-foreground border-r-2 border-separate">
      <div className="flex items-center justify-center gap-2 border-b-[1px] border-separate p-4">
        <Logo />
      </div>
      <div className="p-2">
        TODO CREDITS
      </div>
      <div className="flex flex-col space-y-1.5 p-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={buttonVariants({
              variant: activeRoute.href === route.href 
                ? "default" 
                : "outline",
              className: "!justify-start"
            })}
          >
            <route.icon size={20} />
            {route.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
