const router = require("express").Router();
const {
  getThoughts,
  createNewThought,
  getSingleThought,
  updateThought,
  deleteThought,
  addReaction,
  deleteReaction,

  // GET to get all thoughts
  // GET to get a single thought by its _id
  // POST to create a new thought (don't forget to push the created thought's _id to the associated user's thoughts array field)
  // PUT to update a thought by its _id
  // DELETE to remove a thought by its _id
  // /api/thoughts/:thoughtId/reactions
  // POST to create a reaction stored in a single thought's reactions array field
  // DELETE to pull and remove a reaction by the reaction's reactionId value
} = require("../../controllers/thoughtController.js");

router.route("/").get(getThoughts).post(createNewThought);

router
  .route("/:thoughtId")
  .get(getSingleThought)
  .put(updateThought)
  .delete(deleteThought);

router.route("/:thoughtId/reactions").post(addReaction);

router.route("/:thoughtId/reactions/:reactionId").delete(deleteReaction);

module.exports = router;
