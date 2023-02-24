const express = require("express");
const app = express();
const router = express.Router();
const {homePage, addNote, deleteNote, getNotes} = require("../controllers/controller");

router.get('/', homePage);
router.post('/add-note', addNote);
router.post('/delete-note', deleteNote);
router.get('/get-notes', getNotes);

module.exports = router;