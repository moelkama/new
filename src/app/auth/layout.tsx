import ResetSuccessModal from "@/app/auth/login/_components/ResetPasswordModal";
import RestaurantLogo from "@/components/shared/RestaurantLogo";
import { tv } from "tailwind-variants";

const pageStyles = tv({
  slots: {
    base: "flex h-screen flex-col lg:flex-row",
    aside:
      "bg-brand-accent flex w-full items-center justify-center rounded-2xl py-18 lg:max-w-xl lg:rounded-none",
    main: "flex h-full w-full items-center justify-center",
  },
});

const { base, aside, main } = pageStyles();
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className={base()}>
        <aside className={aside()}>
          <RestaurantLogo size="lg" url={"/primosLogo.png"} />
        </aside>
        <main className={main()}>{children}</main>
      </div>
      <ResetSuccessModal />
    </>
  );
}
