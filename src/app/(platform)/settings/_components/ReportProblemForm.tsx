"use client";

import { useState } from "react";
import { FiEdit, FiMail, FiUser } from "react-icons/fi";
import { MdPhone } from "react-icons/md";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { tv } from "tailwind-variants";
import { useApi } from "@/hooks/apis/useApi";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";

const reportProblemSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

interface ReportResponseType {
  id: string;
  status: string;
  message?: string;
}

type ReportProblemInputs = z.infer<typeof reportProblemSchema>;

const styles = tv({
  slots: {
    form: "mt-5 flex w-full flex-col gap-6 p-2",
    row: "flex w-full flex-col gap-4 md:flex-row",
    halfColumn: "w-full md:w-1/2",
    fullColumn: "w-full",
    buttonContainer: "mt-4 w-full",
    successMessage: "mt-4 p-3 bg-green-50 text-green-700 rounded-md",
    errorMessage: "mt-4 p-3 bg-red-50 text-red-700 rounded-md",
  },
});

const { form, row, halfColumn, fullColumn, buttonContainer, successMessage, errorMessage } = styles();

const ReportProblemForm = () => {
  const { useApiMutation } = useApi();
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState("");

  const reportProblemMutation = useApiMutation<ReportResponseType, ReportProblemInputs>(
    "/api/restaurants/1/reports/",
    "POST",
    {
      onSuccess: () => {
        setSubmitStatus('success');
        reset();
      },
      onError: (error) => {
        setSubmitStatus('error');
        setErrorMsg(error.message || "An error occurred while submitting your report");
      },
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ReportProblemInputs>({
    resolver: zodResolver(reportProblemSchema),
  });

  const onSubmit = async (data: ReportProblemInputs) => {
    try {
      setSubmitStatus('idle');
      await reportProblemMutation.mutateAsync(data);
    } catch (error) {
      console.error("Submission failed", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={form()} noValidate>
        <div className={row()}>
          <div className={halfColumn()}>
            <InputField
              label="Full name"
              type="text"
              icon={<FiUser />}
              variant="secondary"
              size="sm"
              fullWidth
              error={errors.fullName}
              {...register("fullName")}
            />
          </div>
          <div className={halfColumn()}>
            <InputField
              label="Primary email address"
              type="email"
              icon={<FiMail />}
              variant="secondary"
              size="sm"
              fullWidth
              error={errors.email}
              {...register("email")}
            />
          </div>
        </div>

        <div className={row()}>
          <div className={halfColumn()}>
            <InputField
              label="Mobile phone number"
              type="tel"
              icon={<MdPhone />}
              variant="secondary"
              size="sm"
              fullWidth
              error={errors.phone}
              {...register("phone")}
            />
          </div>
          <div className={halfColumn()}></div>
        </div>

        <div className={row()}>
          <div className={fullColumn()}>
            <InputField
              label="Leave a message"
              type="textarea"
              icon={<FiEdit />}
              variant="secondary"
              size="sm"
              fullWidth
              error={errors.message}
              {...register("message")}
            />
          </div>
        </div>

        {submitStatus === 'error' && (
          // Fix 2: Replace unescaped apostrophe
          <div className={errorMessage()}>
            {errorMsg || "An error occurred while submitting your report. Please try again later."}
          </div>
        )}

        <div className={buttonContainer()}>
          <Button
            variant="primary"
            size="lg"
            type="submit"
            fullWidth
            disabled={isSubmitting || reportProblemMutation.isPending
            }
          >
            {(isSubmitting || reportProblemMutation.isPending) ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>

      {submitStatus === 'success' && (
        <div className={successMessage()}>
          Your problem has been reported successfully. We will get back to you soon.
        </div>
      )}

    </>
  );
};

export default ReportProblemForm;