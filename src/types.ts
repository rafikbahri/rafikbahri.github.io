export type Site = {
  TITLE: string;
  DESCRIPTION: string;
  EMAIL: string;
  NUM_POSTS_ON_HOMEPAGE: number;
  NUM_PROJECTS_ON_HOMEPAGE: number;
};

export type Metadata = {
  TITLE: string;
  DESCRIPTION: string;
};

export type Socials = {
  NAME: string;
  HREF: string;
  // Account ID shown next to the logo, e.g. "rafikbahri"
  LABEL: string;
  // Iconify icon name, e.g. "logos:github-icon"
  ICON: string;
  // Invert the logo in dark mode (for black logos)
  INVERT_IN_DARK?: boolean;
}[];
