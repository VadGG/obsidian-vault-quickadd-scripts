import { TFile } from "obsidian";
import { Params } from "./types";

/**
 * Adds parent tags to a subtopic file to ensure tag inheritance.
 */
export async function inheritTags(
  params: Params,
  subtopicFile: TFile,
  parentTags: string[],
): Promise<void> {
  const { app } = params;
  const { update } = app.plugins.plugins["metaedit"].api;

  // Retrieve the current tags in the subtopic file's frontmatter
  const currentTags = await getCurrentTags(params, subtopicFile);

  // Ensure no duplicate tags by merging and deduplicating tags
  const inheritedTags = Array.from(new Set([...currentTags, ...parentTags]));

  // Update the file's frontmatter with the new list of tags
  await update("tags", inheritedTags, subtopicFile);
}

/**
 * Fetches the current tags from the frontmatter of a given file.
 */
async function getCurrentTags(params: Params, file: TFile): Promise<string[]> {
  const { app } = params;
  const { getPropertyValue } = app.plugins.plugins["metaedit"].api;

  const tags = await getPropertyValue("tags", file);
  return Array.isArray(tags) ? tags : tags ? [tags] : [];
}
