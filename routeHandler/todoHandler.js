const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const todoSchema = require("../schema/todoSchema");
const userSchema = require("../schema/userSchema");
const Todo = mongoose.model("Todo", todoSchema);
const User = mongoose.model("User", userSchema);
const checkLogin = require("../middlewares/checkLogin");

// get all todos
router.get("/", checkLogin, async (req, res) => {
  try {
    const todos = await Todo.find()
      .populate("user", "username user -_id")
      .select({ _id: 0, __v: 0 });
    // .limit(1);
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: "There was an error in server side" });
  }
});

// get active todos
router.get("/active", async (req, res) => {
  try {
    const activeTodos = new Todo();
    console.log(activeTodos);
    const data = await activeTodos.findActive();
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: "There was an error in server side" });
  }
});

// get js todo
router.get("/js", async (req, res) => {
  try {
    const data = await Todo.findByJs();
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: "There was an error in server side" });
  }
});
// get todo by language
router.get("/language", async (req, res) => {
  try {
    const data = await Todo.find().byLanguage("api");
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: "There was an error in server side" });
  }
});

// get a todo by id
router.get("/:id", async (req, res) => {
  try {
    const todoId = req.params.id;
    const todo = await Todo.findById(todoId).select({ _id: 0, __v: 0 });
    if (todo) {
      res.status(200).json(todo);
    } else {
      res.status(404).json({ error: "Todo not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "There was an error in server side" });
  }
});

// post todo
router.post("/", checkLogin, async (req, res) => {
  try {
    const newTodo = new Todo({ ...req.body, user: req.userId });
    // console.log(newTodo);
    // console.log(req.userId);
    const todo = await newTodo.save();
    await User.updateOne({ _id: req.userId }, { $push: { todos: todo._id } });
    // console.log(todo);
    res.status(200).json({ message: "Data inserted successfully" });
  } catch (error) {
    res.status(500).json({ error: "There was an error in server side" });
  }
});

// post all todos
router.post("/all", async (req, res) => {
  try {
    await Todo.insertMany(req.body);
    res.status(200).json({ message: "All Data inserted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "There was an error in all data post in server side" });
  }
});

// update a todo by id
router.put("/:id", async (req, res) => {
  try {
    const result = await Todo.findByIdAndUpdate(
      { _id: req.params.id },
      [{ $set: { status: "inactive" } }, { $set: { title: "JavaScript" } }],
      { new: true }
    );
    console.log(result);
    res.status(200).json({ message: "Individual id data updated" });
  } catch (error) {
    res.status(500).json({ error: "There was a problem in server side!" });
  }
});

// delete a todo
router.delete("/:id", async (req, res) => {
  try {
    const todoId = req.params.id;
    const deletedTodo = await Todo.deleteOne({ _id: todoId });
    console.log(deletedTodo);
    if (deletedTodo.deletedCount === 0) {
      res.status(404).json({ error: "Todo not found" });
    } else {
      res.status(200).json({ message: "Deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "There was an error in server side" });
  }
});

module.exports = router;
