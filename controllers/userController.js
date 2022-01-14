const { User, Thought } = require("../models");

const friendCount = async () =>
  User.aggregate()
    .count("friends")
    .then((numberOfFriends) => numberOfFriends);

module.exports = {
  // Get all users
  getAllUsers(req, res) {
    User.find()
      .then(async (users) => {
        const userObject = {
          users,
          friendCount: await friendCount(),
        };
        return res.json(userObject);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Get a single user
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select("-__v")
      .then(async (user) =>
        !user
          ? res.status(404).json({ message: "No user with that ID" })
          : res.json({
              user,
              friends: await req.params.userId,
              thoughts: await req.params.userId,
            })
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },

  //   update user
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with this id!" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Delete a user and remove their thoughts
  deleteUser(req, res) {
    User.findOneAndRemove({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No such user exists" })
          : Thought.findOneAndUpdate(
              { students: req.params.userId },
              { $pull: { students: req.params.userId } },
              { new: true }
            )
      )
      .then((thought) =>
        !thought
          ? res.status(404).json({
              message: "User deleted, but no thoughts found",
            })
          : res.json({
              message: "User and thier thoughts successfully deleted",
            })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // Add a friend
  addFriend(req, res) {
    console.log("You are adding a Friend");
    console.log(req.body);
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } }, // req.params.friendId} },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res
              .status(404)
              .json({ message: "No user found with that ID 'VwV' " })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Remove friend from a user
  removefriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user found with that ID :(" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
};
