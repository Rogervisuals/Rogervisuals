import type { GeneralSettings } from "@/lib/site-settings/general";

interface SiteThemeProps {
  settings: GeneralSettings;
}

export function SiteTheme({ settings }: SiteThemeProps) {
  const { colors, typography } = settings;

  const css = `:root {
  --white: ${colors.white};
  --silver: ${colors.silver};
  --mine-shaft: ${colors.mineShaft};
  --shark: ${colors.shark};
  --mariner: ${colors.mariner};
  --background: ${colors.shark};
  --foreground: ${colors.silver};
  --type-scale: ${typography.fontScale};
}`;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
