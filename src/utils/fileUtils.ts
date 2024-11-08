export function stripMdFormatFromFilename(filename: string): string {
  return filename.replace(/\[\[(.*?)\]\]/, "$1");
}

export function findFile(params: any, targetFilename: string): any {
  if (!targetFilename) return null;
  targetFilename = stripMdFormatFromFilename(targetFilename);
  return params.app.vault
    .getMarkdownFiles()
    .find((file) => file.basename === targetFilename);
}

export async function findAllFilesWith(
  params: any,
  keyToSearch: string,
  matchValue: any,
): Promise<FileWithCache[]> {
  const markdownFiles = params.app.vault.getMarkdownFiles();
  const filesWithKey: FileWithCache[] = [];
  for (let file of markdownFiles) {
    const cache = getMetadataForPath(params, file);
    const metaValue = getValueForKey(params, cache, keyToSearch);
    if (metaValue && (matchValue === undefined || metaValue === matchValue)) {
      filesWithKey.push({ file, cache });
    }
  }
  return filesWithKey;
}
