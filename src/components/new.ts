import { CONTENT_TYPES } from "../utils/constants";
import { createContent } from "../utils/contentCreator";

export default async function main(params: any): Promise<void> {
  const contentTypeChoices = Object.fromEntries(
    Object.values(CONTENT_TYPES).map((type) => [
      type.display,
      () => createContent(params, type),
    ]),
  );

  const selected = await params.quickAddApi.suggester(
    Object.keys(contentTypeChoices),
    Object.values(contentTypeChoices),
  );

  if (selected) {
    await selected();
  }
}
