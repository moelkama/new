import React from "react";
import RestaurantLogo from "../shared/RestaurantLogo";
import { tv } from "tailwind-variants";
import NavigationMenu from "../shared/NavigationMenu";

type TypeProps = {
  navItems: {
    href: string;
    label: string;
    icon: React.ReactNode;
  }[];
  className?: string;
};

const styles = tv({
  slots: {
    sidebar: "space-y-4 bg-[#F4F9F9] px-4 py-2",
  },
});

const { sidebar } = styles();

const SideBar: React.FC<TypeProps> = ({ navItems, className }) => {
  return (
    <aside className={sidebar({ className })}>
      <div className={"px-4"}>
        <RestaurantLogo size="sm" url="/primosLogo.png" className=" " />
      </div>

      <NavigationMenu navItems={navItems} />

      <div className={""}></div>
    </aside>
  );
};

export default SideBar;
