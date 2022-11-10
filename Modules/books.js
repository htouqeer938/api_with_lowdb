const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");

const idLength = 8;

/**
 * @swagger
 * components:
 *    schemas:
 *     books:
 *          type: object
 *          required:
 *               - title
 *               - author
 *          properties:
 *            id:
 *                type: string
 *                description: The auto-generated id of the book
 *            title:
 *                type: string
 *                description: The book title
 *            author:
 *                type: string
 *                description: The book author
 *          example:
 *            id: d543ff
 *            title: The new Turning OmniBus
 *            author: Alexnder
 */

/**
 * @swagger
 * /books:
 *    get:
 *       summary: Return the List of all books
 *       responses:
 *          200:
 *              description: The list of books
 *              content:
 *                 application/json:
 *                    schema:
 *                      type: array
 *                      items:
 *                         $ref: '#/components/schemas/books'
 */
router.get("/", (req, res) => {
    const books = req.app.db.get("books");
    res.send(books);
});

router.get("/:id", (req, res) => {
    const book = req.app.db.get("books").find({ id: req.params.id }).value();
    if (!book) {
        res.sendStatus(404);
    }
    res.send(book);
});

router.post("/", (req, res) => {
    try {
        const book = {
            id: nanoid(idLength),
            ...req.body
        };
        const addBook = req.app.db.get("books").push(book).write();
        res.send(addBook);
    } catch (error) {
        return res.status(500).send(error);
    }
});

router.put("/:id", (req, res) => {
    try {
        router.app.db
            .get("books")
            .find({ id: req.params.id })
            .assign(req.body)
            .write();
        res.send(router.app.db.get("books").find({ id: req.params.id }));
    } catch (error) {
        return res.status(500).send(error);
    }
});

router.delete("/:id", (req, res) => {
    try {
        router.app.db.get("books").remove({ id: req.params.id }).write();
        res.sendStatus(200);
    } catch (error) {
        return res.status(500).send(error);
    }
});

module.exports = router;
