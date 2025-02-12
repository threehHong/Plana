import * as React from "react";

import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className={cn("flex w-full")}>
        <div
          className={cn(
            "flex h-10 items-center rounded-md border border-input bg-white pl-1 text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-1 border-gray-300 focus:border-blue-500",
            className
          )}
        >
          <SearchIcon className="h-[18px] w-[18px] ml-2 text-black" />
          <input
            type={type}
            className={cn(
              "w-full p-2 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 placeholder-gray-400 text-black",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
