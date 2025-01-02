"use client";

import Link from "next/link";

import { useState } from "react";
import { MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import { routes } from "@/constants/routes";

import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";

import { Logo } from "@/components/logo";

export const MobileSidebar = () => {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  const activeRoute = routes.find((route) => route.href.length > 0 && pathname.includes(route.href)) || routes[0];

  return (
    <div className="block border-separate bg-background md:hidden">
      <nav className="container flex items-center justify-between px-8">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px] space-y-4" side="left">
            <Logo />
            <div className="flex flex-col gap-1">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={buttonVariants({
                    variant: activeRoute.href === route.href 
                      ? "default" 
                      : "ghost",
                  })}
                  onClick={() => setIsOpen((prev) => !prev)}
                >
                  <route.icon size={20} />
                  {route.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}