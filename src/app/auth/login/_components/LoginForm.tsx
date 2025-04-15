"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { FiKey, FiMail } from "react-icons/fi";
import { tv } from "tailwind-variants";
import InputField from "@ui/InputField";
import Button from "@ui/Button";
import loginAction from "../loginAction";
import { useSearchParams } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const styles = tv({
  slots: {
    form: "@container w-full flex-col items-center justify-between space-y-6",
    field: "mb-2",
    buttonsContainer: "mt-5 space-y-2 @md:flex @md:gap-5.5 @md:space-y-0",
    button: "",
    forgetPasswordLink:
      "text-body-small text-dark-3 m-auto mt-2 block w-fit text-center",
    formError: "m-auto min-h-[1.2rem] text-center text-sm text-red-500",
  },
});

const { form, field, buttonsContainer, forgetPasswordLink, formError } =
  styles();

type LoginFormInputs = z.infer<typeof loginSchema>;
interface LoginFormProps {
  className?: string;
}
const LoginForm: React.FC<LoginFormProps> = ({ className }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isLoading },
    setError,
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("redirectTo", callbackUrl);

      const result = await loginAction(formData);

      if (result?.error) {
        setError("root", {
          type: "manual",
          message: result.error,
        });
      }
    } catch (error) {
      if (!String(error).includes("NEXT_REDIRECT")) {
        setError("root", {
          type: "manual",
          message: "An unexpected error occurred",
        });
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={form({ className })}
      noValidate
    >
      <InputField
        className={field()}
        label="EMAIL ADDRESS"
        type="email"
        icon={<FiMail size={24} />}
        error={errors.email}
        placeholder="Enter your email"
        autoComplete="current-email"
        {...register("email")}
      />
      <InputField
        className={field()}
        label="PASSWORD"
        icon={<FiKey size={24} />}
        type="password"
        error={errors.password}
        placeholder="Enter your password"
        autoComplete="current-password"
        {...register("password")}
      />

      <div className={buttonsContainer()}>
        <Button
          size="lg"
          fullWidth
          type="submit"
          disabled={isSubmitting || isLoading}
        >
          {isSubmitting || isLoading ? "Signing in..." : "Sign In"}
        </Button>

        <Button
          size="lg"
          fullWidth
          type="button"
          href="/auth/signup"
          variant="secondary"
        >
          Create an account
        </Button>
      </div>
      <div className={formError()}>{errors.root?.message ?? ""}</div>
      <Link className={forgetPasswordLink()} href="/auth/reset-password">
        Forgot Password?
      </Link>
    </form>
  );
};

export default LoginForm;
