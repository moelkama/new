import SideBar from "@/components/layout/SideBar";
import { PageTransition } from "@/libs/PageTransition";
import { FiSettings, FiBookmark, FiShoppingCart, FiUser } from "react-icons/fi";
import { tv } from "tailwind-variants";
import { LiaHomeSolid } from "react-icons/lia";
import { TiDocumentText } from "react-icons/ti";
import { TbMotorbike } from "react-icons/tb";
import StoreSettingsModal from "@/components/modals/StoreSettingsModal";
import EditLoginDetailsModal from "@/components/modals/EditLoginDetailsModal";
import ForgetPasswordModal from "@/components/modals/ForgetPasswordModal";
import EditBusinessContactInfoModal from "@/components/modals/EditBusinessContactInfoModal";
import SupportModal from "./settings/_components/SupportModal";
import ReportProblemModal from "./settings/_components/ReportProblemModal";

const navItems = [
  { href: "/stats", label: "stats", icon: <LiaHomeSolid /> },
  { href: "/orders", label: "Orders", icon: <FiShoppingCart /> },
  { href: "/menu", label: "Menu", icon: <FiBookmark /> },
  { href: "/history", label: "History", icon: <TiDocumentText /> },
  { href: "/dispatch", label: "Dispatch", icon: <TbMotorbike /> },
  { href: "/users", label: "Users", icon: <FiUser /> },
  { href: "/settings", label: "Settings", icon: <FiSettings /> },
];

const pageStyles = tv({
  slots: {
    sidebar: "w-75",
    content: "flex flex-1 flex-col overflow-auto p-4",
    topBar: "bg-white p-8 shadow",
  },
});

const { sidebar, content } = pageStyles();

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {


  return (
    <>
      <div className="flex h-screen w-screen">
        <SideBar className={sidebar()} navItems={navItems} />
        <main className={content()}>
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
      {/* modals */}
      <StoreSettingsModal />
      <EditLoginDetailsModal />
      <ForgetPasswordModal />
      <EditBusinessContactInfoModal />
      <SupportModal />
      <ReportProblemModal />
    </>
  );
}
