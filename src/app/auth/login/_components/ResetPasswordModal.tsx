"use client";

import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { tv } from "tailwind-variants";
import { FiMail } from "react-icons/fi";
import Modal, { ModalClose, useModalProps } from "@/components/ui/Modal";
import { useState, useEffect } from "react";
import { useModalStore } from "@/store/modal-store";
import { sendPasswordResetLink } from "@/app/utils/authUtils";

const styles = tv(
  {
    slots: {
      container: "flex flex-col items-center text-center",
      iconContainer: "mb-6 flex items-center justify-center",
      contentContainer: "mb-12",
      title: "text-heading-3 mb-3 font-bold",
      message: "text-dark-3 text-body-small",
      emailAddress: "text-dark-1 font-semibold",
      buttonsContainer: "flex w-full gap-3",
      primaryButton: "w-full",
      secondaryButton: "",
      statusMessage: "mt-3 text-sm",
      successMessage: "mt-3 text-sm text-green-500",
      errorMessage: "mt-3 text-sm text-red-500",
    },
  },
  {
    twMerge: false,
  },
);

const {
  container,
  iconContainer,
  contentContainer,
  title,
  message,
  emailAddress,
  buttonsContainer,
  primaryButton,
  secondaryButton,
  successMessage,
  errorMessage,
} = styles();

interface ResetSuccessModalProps {
  email: string;
}

const ResetSuccessModal = () => {
  const modalType = "reset_password_modal";
  const props = useModalProps<ResetSuccessModalProps>(modalType);
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<{
    success?: boolean;
    message?: string;
  }>({});

  const isModalOpen = useModalStore((state) => state.modals[modalType]?.isOpen);

  useEffect(() => {
    if (!isModalOpen) {
      setResendStatus({});
      setIsResending(false);
    }
  }, [isModalOpen]);

  const handleSendAgain = async () => {
    if (!props?.email || isResending) return;

    setIsResending(true);
    setResendStatus({});

    try {
      const result = await sendPasswordResetLink(props.email);

      if (result.success) {
        setResendStatus({
          success: true,
          message: "Password reset link sent again successfully!",
        });
      } else {
        setResendStatus({
          success: false,
          message: result.error || "Failed to send reset link again",
        });
      }
    } catch (error) {
      setResendStatus({
        success: false,
        message: "An unexpected error occurred",
      });
      console.error("Failed to resend reset link:", error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Modal
      description="Password Reset Link Sent"
      modalType={modalType}
      title="Password Reset Link Sent"
      hideTitle={true}
      contentClassName="p-8 max-w-[400px]"
    >
      <div className={container()}>
        <div className={iconContainer()}>
          <Icon
            as={FiMail}
            iconSize="lg"
            wrapperSize="lg"
            wrapperVariant="primary"
          />
        </div>

        <div className={contentContainer()}>
          <h1 className={title()}>Reset email sent</h1>
          <p className={message()}>
            {"We have just sent an email with a password reset link to "}
            <span className={emailAddress()}>{props?.email}</span>.
          </p>

          {resendStatus.message && (
            <p
              className={
                resendStatus.success ? successMessage() : errorMessage()
              }
            >
              {resendStatus.message}
            </p>
          )}
        </div>

        <div className={buttonsContainer()}>
          <ModalClose className={primaryButton()} modalType={modalType}>
            <Button variant="primary" size="lg" fullWidth>
              Got it
            </Button>
          </ModalClose>

          <Button
            variant="secondary"
            fullWidth
            className={secondaryButton()}
            onClick={handleSendAgain}
            disabled={isResending}
          >
            {isResending ? "Sending..." : "Send Again"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ResetSuccessModal;
