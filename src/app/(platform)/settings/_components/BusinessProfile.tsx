"use client";
import EditProfileSettingsCard from "@/components/ui/cards/EditProfileSettingsCard";
import { tv } from "tailwind-variants";
import { useUserData } from "@/hooks/apis/useUserData";
import ContentLoader from "react-content-loader";

const styles = tv({
  slots: {
    base: "@container flex flex-col gap-4 lg:flex-row",
    loginDetails: "w-full lg:w-[40%]",
    businessContactDetails: "w-full lg:w-[60%]",
    loadingContainer: "h-80 rounded-xl border-1 border-[#AACCCE] px-6 py-12",
  },
});

interface BusinessProfileProps {
  className?: string;
}

const { base, businessContactDetails, loginDetails, loadingContainer } = styles();

// Shared skeleton component with configurable field count
const SettingsCardSkeleton = ({ fields = 1 }) => (
  <ContentLoader
    speed={2}
    width="100%"
    height={300}
    viewBox="0 0 400 300"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    {/* Card header */}
    <rect x="0" y="10" rx="4" ry="4" width="180" height="20" />
    <rect x="0" y="40" rx="3" ry="3" width="280" height="10" />

    {/* Dynamically render fields based on count */}
    {[...Array(fields)].map((_, i) => (
      <>
        {/* Field label */}
        <rect x="0" y={80 + i * 80} rx="3" ry="3" width={80 + (i % 2) * 40} height="12" />

        {/* Field input */}
        <rect x="0" y={100 + i * 80} rx="3" ry="3" width="250" height="35" />

        {/* Badge (only for some fields) */}
        {i % 2 === 0 && (
          <rect x="270" y={110 + i * 80} rx="15" ry="15" width={80 + (i % 3) * 40} height="20" />
        )}
      </>
    ))}
  </ContentLoader>
);

const BusinessProfile: React.FC<BusinessProfileProps> = ({ className }) => {
  const { data: userData, isLoading, error } = useUserData();

  if (isLoading) {
    return (
      <div className={base({ className })}>
        {/* Login details skeleton - single field */}
        <div className={`${loadingContainer()} ${loginDetails()}`}>
          <SettingsCardSkeleton fields={1} />
        </div>

        {/* Business contact details skeleton - two fields */}
        <div className={`${loadingContainer()} ${businessContactDetails()}`}>
          <SettingsCardSkeleton fields={2} />
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="rounded-md bg-red-50 p-4 text-red-500">
        Failed to load user profile. Please try again later.
      </div>
    );
  }

  return (
    <div className={base({ className })}>
      <EditProfileSettingsCard
        title="Login details"
        description="This is the email you use to log in in the Manager Portal."
        fields={[
          {
            label: "Email",
            value: userData.email,
            badge: { text: "VERIFIED", active: true },
          },
        ]}
        className={loginDetails()}
        userData={userData}
      />

      <EditProfileSettingsCard
        title="Business contact details"
        description="Get updates about your performance, new features, and regulations."
        fields={[
          {
            label: "Email",
            value: userData.email,
          },
          {
            label: "Phone number",
            value: userData.phone_number || "Not provided",
            badge: {
              text: userData.phone_number
                ? "WHATSAPP ENABLED"
                : "WHATSAPP DISABLED",
              active: !!userData.phone_number,
            },
          },
        ]}
        className={businessContactDetails()}
        userData={userData}
      />
    </div>
  );
};

export default BusinessProfile;