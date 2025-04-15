import { tv } from "tailwind-variants";

const styles = tv({
  base: "",
});

interface StoreStatusProps {
  className?: string;
}

const StoreStatus: React.FC<StoreStatusProps> = ({ className }) => {
  return <div className={styles({ className })}></div>;
};

export default StoreStatus;
