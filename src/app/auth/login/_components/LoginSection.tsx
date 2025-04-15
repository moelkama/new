import LoginForm from "@/app/auth/login/_components/LoginForm";
import { tv } from "tailwind-variants";

const styles = tv({
  slots: {
    base: "w-full max-w-xl flex-col items-center justify-between space-y-4 px-4",
    title: "text-brand-main text-heading-1 mt-10",
    description: "text-body-normal text-dark-3",
    form: "py-10",
  },
});

const { base, title, description, form } = styles();

const LoginSection = ({ }) => {
  return (
    <div className={base()}>
      <h1 className={title()}>Welcome!</h1>
      <p className={description()}>Sign in to your account to continue </p>
      <LoginForm className={form()} />
    </div>
  );
};

export default LoginSection;
