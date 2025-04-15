import { tv } from "tailwind-variants";
import ResetPasswordForm from "./ResetPasswordForm";

const styles = tv({
  slots: {
    base: "w-full max-w-xl flex-col items-center justify-between space-y-4 px-4",
    title: "text-heading-1 font-medium",
    description: "text-dark-3 text-[20px]",
    form: "py-10",
  },
});

const { base, title, description, form } = styles();

export default function ForgetPasswordSection() {
  return (
    <div className={base()}>
      <h1 className={title()}>Forgot password?</h1>
      <p className={description()}>
        Please enter your email address to continue
      </p>
      <ResetPasswordForm className={form()} />
    </div>
  );
}
