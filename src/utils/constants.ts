export const FOLDER_PATHS = {
  TEMPLATES: "99_Organize/Templates",
  KEYS: "00_Keys",
  HOW_TOS: "20_HowTos",
  RESOURCES: "30_Resources",
};

export const METADATA_FIELDS = {
  CLASS: "Class",
  SUBFOLDER: "subfolder",
  PARENT: "parent",
  TAGS: "tags",
};

export const TEMPLATE_NAMES = {
  HOWTO: "HowToTemplate",
  SUBTOPIC: "SubtopicTemplate",
  RESOURCE: "ResourceTemplate",
};

export const CLASS_TYPES = {
  TOPIC: "Topic",
};

export const CONTENT_TYPES = {
  howto: {
    display: "How To",
    folder: FOLDER_PATHS.HOW_TOS,
    template: `${FOLDER_PATHS.TEMPLATES}/${TEMPLATE_NAMES.HOWTO}`,
    parentType: "direct",
  },
  subtopic: {
    display: "Sub Topic",
    folder: FOLDER_PATHS.KEYS,
    template: `${FOLDER_PATHS.TEMPLATES}/${TEMPLATE_NAMES.SUBTOPIC}`,
    parentType: "topic",
  },
  resource: {
    display: "Resource",
    folder: FOLDER_PATHS.RESOURCES,
    template: `${FOLDER_PATHS.TEMPLATES}/${TEMPLATE_NAMES.RESOURCE}`,
    parentType: "direct",
  },
};
