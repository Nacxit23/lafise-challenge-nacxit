import React from "react";
import { cn } from "@/lib/utils";

type ContainerProps = React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>;

const Container = ({ children, className, ...rest }: ContainerProps) => {
  return (
    <div className={cn("flex min-h-screen items-center justify-center px-4", className)} {...rest}>
      {children}
    </div>
  );
};

export default Container;
