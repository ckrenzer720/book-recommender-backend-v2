const express = require("express");
const router = express.Router();

const collectionsController = require("../../controllers/collectionsController");

// Collections routes
router.get("/", collectionsController.getUserCollections);

router.get("/:id", collectionsController.getCollectionById);

router.post("/", collectionsController.createCollection);

router.put("/:id", collectionsController.updateCollection);

router.delete("/:id", collectionsController.deleteCollection);

// Collection books management
router.post("/:id/books", collectionsController.addBookToCollection);

router.delete(
  "/:id/books/:bookId",
  collectionsController.removeBookFromCollection
);

module.exports = router;
