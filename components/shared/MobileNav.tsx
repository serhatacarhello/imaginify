"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { navLinks } from "@/constants";
import { SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { useState } from "react";
import { debounce } from "@/lib/utils";

const MobileNav = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSheet = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    debounce(() => toggleSheet(), 350)();
  };

  return (
    <header className="header">
      <Link href="/" className={"flex items-center gap-2 md:py-2"}>
        <Image
          src={"/assets/images/logo-text.svg"}
          alt="logo"
          width={180}
          height={28}
        />
      </Link>
      <nav className="flex gap-2">
        <UserButton afterSignOutUrl="/" />
        <Sheet open={isOpen} onOpenChange={toggleSheet}>
          <SheetTrigger>
            <Image
              src={"/assets/icons/menu.svg"}
              alt="menu"
              width={32}
              height={32}
              className="cursor-pointer"
            />
          </SheetTrigger>
          <SheetContent className="sheet-content sm:w-64 overflow-auto">
            <Image
              src={"/assets/images/logo-text.svg"}
              alt="logo"
              width={152}
              height={23}
            />
            <ul className="header-nav_elements">
              {navLinks.map((link) => {
                const isActive = link.route === pathname;

                return (
                  <li
                    key={link.route}
                    className={`${
                      isActive && "gradient-text"
                    } p-18  flex whitespace-nowrap text-dark-700`}
                  >
                    <Link
                      href={link.route}
                      className="sidebar-link"
                      onClick={handleLinkClick}
                    >
                      <Image
                        alt="logo"
                        src={link.icon}
                        width={24}
                        height={24}
                      />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </SheetContent>
        </Sheet>
        <SignedOut>
          <Button className="button bg-purple-gradient bg-cover" asChild>
            <Link href={"/sign-in"}>Login</Link>
          </Button>
        </SignedOut>
      </nav>
    </header>
  );
};

export default MobileNav;
