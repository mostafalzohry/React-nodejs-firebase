const express = require("express");
const router = express.Router();
const multer = require("multer");
const admin = require("firebase-admin");

const {
  uploadImage,
  readImage,
  updateImage,
  deleteImage,
  shortenUrl,
} = require("./crud-operations");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/uploadImage", upload.single("file"), async (req, res) => {
  try {
    const imageUrl = await uploadImage(req.file);

    const shortenedUrl = await shortenUrl(imageUrl, req.body.userId);

    res.status(201).json({ shortenedUrl });
  } catch (error) {
    res.status(500).send("Error uploading image: " + error.message);
  }
});

router.get("/readImage/:docId", async (req, res) => {
  try {
    const imageUrl = await readImage(req.params.docId);
    res.status(201).json({ imageUrl });

  } catch (error) {
    res.status(500).send("Error reading image: " + error.message);
  }
});


router.put("/updateImage/:userId", upload.single("file"), async (req, res) => {
  try {
    const userId = req.params.userId;
    const newImageData = req.file;

    const { newImageUrl, newImageShortenedUrl } = await updateImage(
      userId,
      newImageData
    );

    res.status(201).json({ newImageUrl, newImageShortenedUrl });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating image: " + error.message);
  }
});

// Route for deleting an image
router.delete("/deleteImage/:docId", async (req, res) => {
  try {
    await deleteImage(req.params.docId);
    res.send("Image and Firestore document deleted successfully.");
  } catch (error) {
    res.status(500).send("Error deleting image: " + error.message);
  }
});

module.exports = router;
