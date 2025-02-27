import { createBook } from "../controllers/BookController";
import Book from "../models/Book"

beforeEach(() => {

});
describe("create book", () => {
    test("create success", async () => {
        const newBook = {
            title: "Harry Potter, tome 1 : Harry Potter à l'école des sorciers",
            authorId: 1,
            isbn: "2070541274",
            editorId: 1,
            formatId: 1,
            availabe: true
        }

        const response = await createBook(newBook);

        expect(response.body.newBook).toMatchObject(new Book(
            "Harry Potter, tome 1 : Harry Potter à l'école des sorciers",
            1,
            "2070541274",
            1,
            1,
            true
        ));
        expect(response.status).toBe(201);
    });

    test("create failed, missing fields", () => {
        const newBook = {
            title: "Harry Potter, tome 1 : Harry Potter à l'école des sorciers",
            authorId: 1,
            isbn: "2070541274",
            editorId: 1,
        }

        const response = await createBook(newBook);

        expect(response.body).toEqual({error: errorEnum.MISSING_FIELDS});
        expect(response.status).toBe(400);
    });

    test("create failed, isbn invalid", () => {
        const newBook = {
            title: "Harry Potter, tome 1 : Harry Potter à l'école des sorciers",
            authorId: 1,
            isbn: "2970541274",
            editorId: 1,
            formatId: 1,
            availabe: true
        }

        const response = await createBook(newBook);

        expect(response.body).toEqual({error: errorEnum.ISBN_INVALID});
        expect(response.status).toBe(400)
    });

    test("create failed, isbn too long", () => {
        const newBook = {
            title: "Harry Potter, tome 1 : Harry Potter à l'école des sorciers",
            authorId: 1,
            isbn: "20705412744",
            editorId: 1,
            formatId: 1,
            availabe: true
        }

        const response = await createBook(newBook);

        expect(response.body).toEqual({error: errorEnum.ISBN_INVALID_LENGTH});
        expect(response.status).toBe(400)
    });


    test("create failed, author doesn't exists", () => {
        const newBook = {
            title: "Harry Potter, tome 1 : Harry Potter à l'école des sorciers",
            authorId: 99999999,
            isbn: "2070541274",
            editorId: 1,
            formatId: 1,
            availabe: true
        }

        const response = await createBook(newBook);

        expect(response.body).toEqual({error: errorEnum.AUTHOR_NOT_FOUND});
        expect(response.status).toBe(404)
    });

    test("create failed, editor doesn't exists", () => {
        const newBook = {
            title: "Harry Potter, tome 1 : Harry Potter à l'école des sorciers",
            authorId: 1,
            isbn: "2070541274",
            editorId: 99999999,
            formatId: 1,
            availabe: true
        }

        const response = await createBook(newBook);

        expect(response.body).toEqual({error: errorEnum.EDITOR_NOT_FOUND});
        expect(response.status).toBe(404)
    });

    test("create failed, format doesn't exists", () => {
        const newBook = {
            title: "Harry Potter, tome 1 : Harry Potter à l'école des sorciers",
            authorId: 1,
            isbn: "2070541274",
            editorId: 1,
            formatId: 99999999,
        }

        const response = await createBook(newBook);

        expect(response.body).toEqual({error: errorEnum.FORMAT_NOT_FOUND});
        expect(response.status).toBe(404)
    });
})