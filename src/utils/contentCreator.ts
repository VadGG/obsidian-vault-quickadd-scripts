import { getAllTopics, getAllTopicsAndSubtopics } from "./topicHandler";
import { createNewFileFromTemplate, updateFileTags } from "./fileHandler";
import { CONTENT_TYPES, METADATA_FIELDS } from "./constants";
import { Params, ContentType, SelectedItem } from "./types";

export async function createContent(
  params: Params,
  contentType: ContentType,
): Promise<void> {
  const items =
    contentType === CONTENT_TYPES.subtopic
      ? await getAllTopics(params)
      : await getAllTopicsAndSubtopics(params);

  const selected: SelectedItem | undefined = await params.quickAddApi.suggester(
    items.map((item) => item.display),
    items,
  );

  if (!selected) return;

  let targetFolder: string;
  if (contentType === CONTENT_TYPES.subtopic) {
    const topicSubfolder = selected.cache[METADATA_FIELDS.SUBFOLDER];
    targetFolder = `${topicSubfolder}/${contentType.folder}`;
  } else if (selected.isSubtopic) {
    targetFolder = `${selected.topicFolder}/${contentType.folder}/${selected.file.basename}`;
  } else {
    const topicSubfolder = selected.cache[METADATA_FIELDS.SUBFOLDER];
    targetFolder = `${topicSubfolder}/${contentType.folder}`;
  }

  const newFile = await createNewFileFromTemplate(
    params,
    contentType.template,
    targetFolder,
  );

  if (!newFile) return;

  // Delay to ensure file is created before updating metadata
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const { update } = params.app.plugins.plugins["metaedit"].api;
  const parentPath =
    contentType.parentType === "topic"
      ? `[[${selected.file.path.replace(/\.md$/, "")}|${selected.file.basename}]]`
      : `[[${selected.file.path.replace(/\.md$/, "")}|${selected.file.basename}]]`;

  await update(METADATA_FIELDS.PARENT, parentPath, newFile);

  // Delay before updating tags
  await new Promise((resolve) => setTimeout(resolve, 100));
  await updateFileTags(params, newFile);

  // Final delay before opening the file
  await new Promise((resolve) => setTimeout(resolve, 100));
  await params.app.workspace.openLinkText(
    newFile.basename,
    newFile.path,
    false,
  );

  // Reveal and select the file in the File Explorer view if it exists
  const fileExplorer =
    params.app.workspace.getLeavesOfType("file-explorer")[0]?.view;
  if (fileExplorer) {
    fileExplorer.revealInFolder(newFile);
  }
}
