"use client";

import type { LucideIcon } from "lucide-react";
import { getIconById } from "@/data/icons";

interface CategoryIconProps {
  iconId: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function CategoryIcon({
  iconId,
  size = 16,
  className,
  style,
}: CategoryIconProps) {
  const IconComp: LucideIcon = getIconById(iconId);

  return <IconComp size={size} className={className} style={style} />;
}
