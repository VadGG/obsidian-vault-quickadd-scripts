import {
  findAllFilesWith,
  getValueForKey,
  getAllFilesInFolder,
} from "./fileHandler";
import { Params } from "./types";
import { METADATA_FIELDS, CLASS_TYPES, FOLDER_PATHS } from "./constants";

export async function getAllTopics(params: Params) {
  const topics = await findAllFilesWith(
    params,
    METADATA_FIELDS.CLASS,
    CLASS_TYPES.TOPIC,
  );

  return topics
    .filter((topic) =>
      getValueForKey(params, topic.cache, METADATA_FIELDS.SUBFOLDER),
    )
    .map((topic) => {
      const topicSubfolder = getValueForKey(
        params,
        topic.cache,
        METADATA_FIELDS.SUBFOLDER,
      );
      return {
        display: topic.file.basename,
        file: topic.file,
        cache: topic.cache,
        isSubtopic: false,
        topicFolder: topicSubfolder,
      };
    });
}

export async function getAllTopicsAndSubtopics(params: Params) {
  const topics = await findAllFilesWith(
    params,
    METADATA_FIELDS.CLASS,
    CLASS_TYPES.TOPIC,
  );
  const result = [];

  for (const topic of topics) {
    const topicFolder = getValueForKey(
      params,
      topic.cache,
      METADATA_FIELDS.SUBFOLDER,
    );
    if (!topicFolder) continue;

    result.push({
      display: topic.file.basename,
      file: topic.file,
      cache: topic.cache,
      isSubtopic: false,
      topicFolder: topicFolder,
    });

    const keysFolder = `${topicFolder}/${FOLDER_PATHS.KEYS}`;
    const subtopics = await getAllFilesInFolder(params, keysFolder);

    for (const subtopic of subtopics) {
      const subtopicCache = getMetadataForPath(params, subtopic);
      const parentRef = getParentForMetadata(subtopicCache);
      let parentTopicFolder = topicFolder;

      if (parentRef) {
        const parentFile = await findFile(
          params,
          extractPathFromMdLink(parentRef),
        );
        if (parentFile) {
          const parentCache = getMetadataForPath(params, parentFile);
          parentTopicFolder =
            getValueForKey(params, parentCache, METADATA_FIELDS.SUBFOLDER) ||
            topicFolder;
        }
      }

      result.push({
        display: `${topic.file.basename} - ${subtopic.basename}`,
        file: subtopic,
        cache: subtopicCache,
        isSubtopic: true,
        parentTopic: topic,
        topicFolder: parentTopicFolder,
      });
    }
  }

  return result;
}
