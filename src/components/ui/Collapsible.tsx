"use client";

import {
  ComponentProps,
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { FiChevronRight } from "react-icons/fi";
import { motion } from "framer-motion";
import * as RadixCollapsible from "@radix-ui/react-collapsible";
import { tv } from "tailwind-variants";
import AnimateChangeInHeight from "../../libs/AnimateChangeInHeight";

const styles = tv({
  slots: {
    root: "border-dark-2/29 flex flex-col border-b pt-5",
    trigger:
      "flex cursor-pointer items-center justify-between gap-2 rounded p-4",
    triggerIcon: "text-brand-main text-[24px]",
    triggerText: "text-body-normal font-medium",
    triggerChevronIcon: "text-dark-2",
    contentInner: "p-2",
    triggerContentWrapper: "flex items-center gap-6",
  },
});

const {
  root,
  trigger,
  contentInner,
  triggerChevronIcon,
  triggerIcon,
  triggerText,
  triggerContentWrapper,
} = styles();

const CollapsibleGroupContext = createContext<{
  openId: string | null;
  setOpenId: (id: string | null) => void;
} | null>(null);

export const CollapsibleGroup: React.FC<{
  children: React.ReactNode;
  defaultOpenId?: string;
  className?: string;
}> = ({ children, defaultOpenId, ...props }) => {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);

  const contextValue = useMemo(() => ({
    openId,
    setOpenId
  }), [openId]);

  return (
    <CollapsibleGroupContext.Provider value={contextValue} {...props}>
      {children}
    </CollapsibleGroupContext.Provider>
  );
};

interface CollapsibleProps
  extends ComponentProps<typeof RadixCollapsible.Root> {
  children: React.ReactNode;
  openable?: boolean;
  icon?: React.ReactNode;
  title: string;
  id: string;
  triggerClassName?: string;
  triggerContentClassName?: string;
  triggerIconClassName?: string;
  triggerTextClassName?: string;
  triggerChevronClassName?: string;
  defaultOpen?: boolean;
}

const Collapsible: React.FC<CollapsibleProps> = ({
  children,
  openable = true,
  icon,
  title,
  className,
  id,
  triggerClassName,
  triggerContentClassName,
  triggerIconClassName,
  triggerTextClassName,
  triggerChevronClassName,
  defaultOpen = false,
  ...props
}) => {
  const groupContext = useContext(CollapsibleGroupContext);
  const isInGroup = !!groupContext;

  const [isOpenLocal, setIsOpenLocal] = useState(defaultOpen);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const isOpen = isInGroup ? groupContext?.openId === id : isOpenLocal;
  const shouldSkipAnimation = !hasMounted && (isInGroup ? groupContext?.openId === id : defaultOpen);

  const handleOpenChange = (open: boolean) => {
    if (!openable) return;

    if (isInGroup) {
      groupContext?.setOpenId(open ? id : null);
    } else {
      setIsOpenLocal(open);
    }
  };

  return (
    <RadixCollapsible.Root
      open={isOpen}
      onOpenChange={handleOpenChange}
      className={root({ className })}
      disabled={!openable}
      {...props}
    >
      <RadixCollapsible.Trigger
        className={trigger({ className: triggerClassName })}
      >
        <div className={triggerContentWrapper({ className: triggerContentClassName })}>
          {icon && (
            <span className={triggerIcon({ className: triggerIconClassName })}>
              {icon}
            </span>
          )}
          <span className={triggerText({ className: triggerTextClassName })}>
            {title}
          </span>
        </div>

        <motion.span
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.4 }}
          className={triggerChevronIcon({ className: triggerChevronClassName })}
        >
          <FiChevronRight size={16} />
        </motion.span>
      </RadixCollapsible.Trigger>

      <RadixCollapsible.Content asChild forceMount>
        <AnimateChangeInHeight
          isOpen={isOpen}
          className={contentInner({ className })}
          skipInitialAnimation={shouldSkipAnimation}
        >
          {children}
        </AnimateChangeInHeight>
      </RadixCollapsible.Content>
    </RadixCollapsible.Root>
  );
};

export default Collapsible;