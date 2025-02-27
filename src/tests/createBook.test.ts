import { createBook } from "../controllers/BookController";
import Book from "../models/Book"
import { ErrorEnum } from "../Enums/errorEnum";

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

        expect(response.body).toEqual({error: ErrorEnum.MISSING_FIELDS});
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

        expect(response.body).toEqual({error: ErrorEnum.ISBN_INVALID});
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

        expect(response.body).toEqual({error: ErrorEnum.ISBN_INVALID_LENGTH});
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

        expect(response.body).toEqual({error: ErrorEnum.AUTHOR_NOT_FOUND});
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

        expect(response.body).toEqual({error: ErrorEnum.EDITOR_NOT_FOUND});
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

        expect(response.body).toEqual({error: ErrorEnum.FORMAT_NOT_FOUND});
        expect(response.status).toBe(404)
    });
})