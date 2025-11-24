import type { Metadata, Site, Socials } from "@types";

export const SITE: Site = {
  TITLE: "Rafik Bahri",
  DESCRIPTION: "Software Engineer.",
  EMAIL: "rafikbahri.insat@gmail.com",
  NUM_POSTS_ON_HOMEPAGE: 1,
  NUM_PROJECTS_ON_HOMEPAGE: 1,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "Welcome to my personal blog.",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "A collection of articles on topics I am passionate about.",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION:
    "A collection of my projects with links to repositories.",
};

export const SOCIALS: Socials = [
  {
    NAME: "GitHub",
    HREF: "https://github.com/rafikbahri",
  },
  {
    NAME: "LinkedIn",
    HREF: "https://www.linkedin.com/in/rafik-bahri",
  },
];
