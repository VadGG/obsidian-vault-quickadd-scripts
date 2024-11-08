import { App, TFile, CachedMetadata } from "obsidian";

export type Params = {
  app: App;
  quickAddApi: any; // Define this based on the actual API type of QuickAdd
};

export interface ContentType {
  folder: string;
  template: string;
  parentType: "topic" | "subtopic";
}

export interface SelectedItem {
  display: string;
  file: TFile;
  cache: CachedMetadata | null;
  isSubtopic: boolean;
  topicFolder?: string;
  parentTopic?: SelectedItem;
}

// Constants file reference for content types
export const CONTENT_TYPES: Record<string, ContentType> = {
  topic: {
    folder: "Topics",
    template: "Templates/TopicTemplate.md",
    parentType: "topic",
  },
  subtopic: {
    folder: "Subtopics",
    template: "Templates/SubtopicTemplate.md",
    parentType: "subtopic",
  },
};

// Metadata fields as constants for consistency and ease of reference
export const METADATA_FIELDS = {
  CLASS: "class",
  SUBFOLDER: "subfolder",
  PARENT: "parent",
};

// Class types used for differentiating topics and subtopics
export const CLASS_TYPES = {
  TOPIC: "topic",
  SUBTOPIC: "subtopic",
};

// Folder paths for topics and subtopics
export const FOLDER_PATHS = {
  KEYS: "Keys",
};
