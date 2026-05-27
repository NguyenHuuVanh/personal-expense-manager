"use client";

import * as React from "react";
import { cn } from "@/utils/cn";

const Input = ({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) => {
  return (
    <input
      type={type}
      className={cn(
        "w-full text-base text-gray-500 outline-none pl-4 pr-12 py-2 h-9 bg-[#F2F4F8] focus-visible:outline-[#827BF2] transition-all border-none",
        type === "number" && "no-spinner",
        className,
      )}
      {...props}
    />
  );
};
Input.displayName = "Input";

export { Input };
