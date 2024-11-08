import { Params } from "./types";
import { TFile, CachedMetadata } from "obsidian";

/**
 * Finds all files with a specific metadata key-value pair in their front matter.
 */
export async function findAllFilesWith(
  params: Params,
  key: string,
  value: string,
) {
  const files = params.app.vault.getMarkdownFiles();
  const matchedFiles = [];

  for (const file of files) {
    const cache = params.app.metadataCache.getFileCache(file);
    if (cache?.frontmatter && cache.frontmatter[key] === value) {
      matchedFiles.push({ file, cache });
    }
  }
  return matchedFiles;
}

/**
 * Retrieves a specific metadata value from a file's cached metadata.
 */
export function getValueForKey(
  params: Params,
  cache: CachedMetadata | null,
  key: string,
): string | undefined {
  return cache?.frontmatter ? cache.frontmatter[key] : undefined;
}

/**
 * Gets all files in a specific folder.
 */
export async function getAllFilesInFolder(
  params: Params,
  folderPath: string,
): Promise<TFile[]> {
  const folder = params.app.vault.getAbstractFileByPath(folderPath);
  if (!folder || !("children" in folder)) return [];

  return folder.children.filter((file) => file instanceof TFile) as TFile[];
}

/**
 * Creates a new file from a template.
 */
export async function createNewFileFromTemplate(
  params: Params,
  templatePath: string,
  targetFolder: string,
): Promise<TFile | null> {
  const templateFile = params.app.vault.getAbstractFileByPath(templatePath);
  if (!(templateFile instanceof TFile)) {
    console.warn(`Template file not found: ${templatePath}`);
    return null;
  }

  const templateContent = await params.app.vault.read(templateFile);
  const newFilePath = `${targetFolder}/${templateFile.basename}.md`;
  const newFile = await params.app.vault.create(newFilePath, templateContent);

  return newFile;
}

/**
 * Updates the tags of a file based on predefined rules or metadata fields.
 */
export async function updateFileTags(params: Params, file: TFile) {
  const { update } = params.app.plugins.plugins["metaedit"].api;
  const tags = ["#example-tag"]; // Example: Add specific tags or customize as needed.

  await update("tags", tags.join(" "), file);
}
