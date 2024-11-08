import { METADATA_FIELDS } from "./constants";

export function getMetadataForPath(params: any, file: any): any {
  return params.app.metadataCache.getFileCache(file);
}

export function getParentForMetadata(cache: any): string | undefined {
  return cache?.frontmatter?.[METADATA_FIELDS.PARENT];
}

export function getTagsForMetadata(cache: any): string[] {
  return cache?.frontmatter?.[METADATA_FIELDS.TAGS] || [];
}

export function getValueForKey(params: any, cache: any, key: string): any {
  const metadata = cache?.frontmatter;
  if (!metadata || !metadata.hasOwnProperty(key)) {
    return undefined;
  }
  return metadata[key];
}
