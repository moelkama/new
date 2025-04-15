"use client";
import { NavigationMenu as RadixNavMenu } from "radix-ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { tv } from "tailwind-variants";
import { motion } from "framer-motion";

// Define styles using tailwind-variants
const styles = tv({
  slots: {
    base: "relative",
    list: "flex list-none flex-col",
    item: "text-dark-3 relative flex items-center gap-6 rounded-2xl p-4 capitalize transition-colors duration-200",
    link: "relative z-20 flex w-full items-center gap-6", // Higher z-index to stay above background
    icon: "text-dark-2 relative text-2xl",
    activeItem: "relative font-bold text-white",
    activeIcon: "text-white",
    activeBg: "bg-brand-main absolute inset-0 -z-10 rounded-xl", // Lower z-index to stay below text
  },
});

// Destructure styles
const { base, list, item, link, icon, activeItem, activeIcon, activeBg } =
  styles();

// Define props interface
interface NavigationMenuProps {
  navItems: {
    href: string;
    label: string;
    icon: React.ReactNode;
  }[];
  className?: string;
}

const NavigationMenu = ({ navItems, className }: NavigationMenuProps) => {
  const pathname = usePathname();

  return (
    <RadixNavMenu.Root>
      <div className={base({ className })}>
        <ul className={list()}>
          {navItems.map((navItem) => {
            const isActive = pathname === navItem.href;

            return (
              <RadixNavMenu.Item asChild key={navItem.href}>
                <li className="list-none">
                  <RadixNavMenu.Link
                    className={item()}
                    active={isActive}
                    asChild
                  >
                    <Link href={navItem.href} className={link()}>
                      {isActive && (
                        <motion.div
                          className={activeBg()}
                          layoutId="activeBackground"
                          transition={{
                            type: "spring",
                            stiffness: 1200,
                            damping: 75,
                          }}
                        />
                      )}
                      <span
                        className={icon({
                          className: isActive ? activeIcon() : "",
                        })}
                      >
                        {navItem.icon}
                      </span>
                      <span className={isActive ? activeItem() : ""}>
                        {navItem.label}
                      </span>
                    </Link>
                  </RadixNavMenu.Link>
                </li>
              </RadixNavMenu.Item>
            );
          })}
        </ul>
      </div>
    </RadixNavMenu.Root>
  );
};

export default NavigationMenu;
