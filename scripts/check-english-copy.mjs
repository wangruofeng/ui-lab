import { collectionCases, englishCollections } from "../site/app/library.js";
import { buildPrompt } from "../site/app/prompts.js";

const han = /\p{Script=Han}/u;

function checkCopy(path, fields) {
  for (const [name, value] of Object.entries(fields)) {
    if (han.test(String(value ?? ""))) {
      throw new Error(`Untranslated English copy in ${path} (${name})`);
    }
  }
}

for (const collection of englishCollections) {
  checkCopy(collection.id, {
    title: collection.title,
    description: collection.description,
    author: collection.author,
    edition: collection.edition,
    type: collection.type,
  });

  for (const item of collectionCases(collection)) {
    checkCopy(`${collection.id}/${item.id}`, {
      title: item.title,
      category: item.category,
      scene: item.scene,
      tip: item.tip,
      outline: item.outline,
      notes: item.notes,
      principle: item.principle,
      referenceLabel: item.referenceLabel,
      prompt: buildPrompt(collection, item, "en"),
    });
  }
}
