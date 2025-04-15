import type { Metadata } from "next";
import { tv } from "tailwind-variants";
import GeneralSettings from "./_components/GeneralSettings";
import OtherSettings from "./_components/OtherSettings";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings",
};

const styles = tv({
  slots: {
    base: "mt-27",
    heading: "text-heading-3 ml-4 font-medium",
  },
});

const { base, heading } = styles();

export default function SettingsPage() {
  return (
    <div className={base()}>
      <h1 className={heading()}>Account Settings</h1>
      <GeneralSettings />
      <OtherSettings />
    </div>
  );
}
