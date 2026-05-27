"use client";

import { cn } from "@/utils/cn";
import { Badge } from "@/components/shadcn-ui/badge";
import type { CardProps } from "@/types/right-panel";

function Card({ title, badge, action, children, className }: CardProps) {
  return (
    <div className={cn("bg-white flex flex-col", className ?? "")}>
      <div className="flex items-center justify-between px-3 py-4 shrink-0">
        <div className="flex items-center gap-1.5">
          <h3 className="text-xs font-semibold text-[#1A1D2E]">{title}</h3>
          {badge && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
              {badge}
            </Badge>
          )}
        </div>
        {action}
      </div>
      <div className="overflow-y-auto hide-scrollbar px-3 pb-3">{children}</div>
    </div>
  );
}

export { Card };
