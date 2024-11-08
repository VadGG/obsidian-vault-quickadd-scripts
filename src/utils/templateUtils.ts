import { TFile } from "obsidian";
import { Params, SelectedItem } from "./types";

/**
 * Replaces placeholders in the template content with provided values.
 */
function fillTemplatePlaceholders(
  templateContent: string,
  replacements: Record<string, string>,
): string {
  let filledContent = templateContent;
  for (const [key, value] of Object.entries(replacements)) {
    const placeholder = `{{${key}}}`;
    filledContent = filledContent.replace(new RegExp(placeholder, "g"), value);
  }
  return filledContent;
}

/**
 * Loads a template file, fills it with replacements, and creates a new file from it.
 */
export async function createFileFromTemplate(
  params: Params,
  templatePath: string,
  targetFolder: string,
  replacements: Record<string, string>,
): Promise<TFile | null> {
  const templateFile = params.app.vault.getAbstractFileByPath(templatePath);

  if (!(templateFile instanceof TFile)) {
    console.warn(`Template file not found: ${templatePath}`);
    return null;
  }

  const templateContent = await params.app.vault.read(templateFile);
  const filledContent = fillTemplatePlaceholders(templateContent, replacements);
  const newFileName = `${replacements["title"] || "Untitled"}.md`;
  const newFilePath = `${targetFolder}/${newFileName}`;

  const newFile = await params.app.vault.create(newFilePath, filledContent);
  return newFile;
}

/**
 * Sets up replacements for topic and subtopic placeholders based on the selected item.
 */
export function setupReplacementsForContent(
  selectedItem: SelectedItem,
  parentTopicTitle?: string,
): Record<string, string> {
  const replacements: Record<string, string> = {
    title: selectedItem.display,
    class: selectedItem.isSubtopic ? "subtopic" : "topic",
  };

  if (parentTopicTitle) {
    replacements["parent"] = parentTopicTitle;
  }

  return replacements;
}

/**
 * Applies frontmatter metadata based on provided replacements.
 */
export async function applyFrontmatter(
  params: Params,
  file: TFile,
  replacements: Record<string, string>,
) {
  const { update } = params.app.plugins.plugins["metaedit"].api;

  for (const [key, value] of Object.entries(replacements)) {
    await update(key, value, file);
  }
}
