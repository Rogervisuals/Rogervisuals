// Re-export project types and filters for backward compatibility
export type {
  Project,
  ProjectCategory,
  ProjectCategoryValue,
} from "@/lib/projects/types";

export {
  categoryLabels,
  getCategoryLabel,
  getCategoriesLabel,
  projectHasCategory,
  projectFilters,
  categoryOptions,
} from "@/lib/projects/types";
