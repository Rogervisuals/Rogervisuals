import { cn } from "@/lib/utils";
import { sectionLabel } from "@/lib/typography";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <p className={cn(sectionLabel, className)}>
      {children}
    </p>
  );
}
