/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  try {
    const collection = app.findCollectionByNameOrId("products");
    return app.delete(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping delete");
      return;
    }
    throw e;
  }
}, (app) => {
  // Note: The down migration cannot restore data, only the collection structure
  // You would need to manually recreate the collection structure here if needed
})
