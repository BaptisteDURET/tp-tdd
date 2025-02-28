import Book from "../models/Book"
import { ErrorEnum } from "../Enums/ErrorEnum";
import app from "../app";
import request from 'supertest';
import { IsbnExceptionsEnum } from "../Enums/IsbnExceptionsEnum";

jest.mock("../repositories/AuthorRepository");
jest.mock("../repositories/BookRepository");
jest.mock("../repositories/EditorRepository");
jest.mock("../repositories/FormatRepository");
import AuthorRepository from "../repositories/AuthorRepository";
import BookRepository from "../repositories/BookRepository";
import EditorRepository from "../repositories/EditorRepository";
import FormatRepository from "../repositories/FormatRepository";

beforeEach(() => {
    jest.resetAllMocks();
});

describe("create book", () => {
    test("create success", async () => {
        (AuthorRepository.checkIdExists as jest.Mock).mockReturnValue(true);
        (EditorRepository.checkIdExists as jest.Mock).mockReturnValue(true);
        (FormatRepository.checkIdExists as jest.Mock).mockReturnValue(true);
        (BookRepository.insertBook as jest.Mock).mockReturnValue(1);
        const newBook = {
            title: "Harry Potter, tome 1 : Harry Potter à l'école des sorciers",
            authorId: 1,
            isbn: "2070541274",
            editorId: 1,
            formatId: 1,
            available: true
        }

        const response = await request(app)
            .post("/book")
            .send(newBook);

        expect(response.body.newBook).toMatchObject(new Book(
            "Harry Potter, tome 1 : Harry Potter à l'école des sorciers",
            "2070541274",
            1,
            1,
            1,
            true
        ));
        expect(response.status).toBe(201);
    });

    test("create failed, missing fields", async () => {
        const newBook = {
            title: "Harry Potter, tome 1 : Harry Potter à l'école des sorciers",
            authorId: 1,
            isbn: "2070541274",
            editorId: 1,
        }

        const response = await request(app)
            .post("/book")
            .send(newBook);

        expect(response.body).toEqual({error: ErrorEnum.MISSING_FIELDS});
        expect(response.status).toBe(400);
    });

    test("create failed, isbn invalid", async () => {
        const newBook = {
            title: "Harry Potter, tome 1 : Harry Potter à l'école des sorciers",
            isbn: "2970541274",
            authorId: 1,
            editorId: 1,
            formatId: 1,
            available: true
        }

        const response = await request(app)
            .post("/book")
            .send(newBook);

        expect(response.body).toEqual({error: ErrorEnum.ISBN_INVALID});
        expect(response.status).toBe(400);
    });

    test("create failed, isbn too long", async () => {
        const newBook = {
            title: "Harry Potter, tome 1 : Harry Potter à l'école des sorciers",
            isbn: "20705412744",
            authorId: 1,
            editorId: 1,
            formatId: 1,
            available: true
        }

        const response = await request(app)
            .post("/book")
            .send(newBook);

        expect(response.body).toEqual({error: IsbnExceptionsEnum.INVALID_ISBN_LENGTH});
        expect(response.status).toBe(400)
    });


    test("create failed, author doesn't exists", async () => {
        (AuthorRepository.checkIdExists as jest.Mock).mockReturnValue(false);
        (EditorRepository.checkIdExists as jest.Mock).mockReturnValue(true);
        (FormatRepository.checkIdExists as jest.Mock).mockReturnValue(true);
        (BookRepository.insertBook as jest.Mock).mockReturnValue(1);
        const newBook = {
            title: "Harry Potter, tome 1 : Harry Potter à l'école des sorciers",
            isbn: "2070541274",
            authorId: 99999999,
            editorId: 1,
            formatId: 1,
            available: true
        }

        const response = await request(app)
            .post("/book")
            .send(newBook);

        expect(response.body).toEqual({error: ErrorEnum.AUTHOR_NOT_FOUND});
        expect(response.status).toBe(404)
    });

    test("create failed, editor doesn't exists", async () => {
        (AuthorRepository.checkIdExists as jest.Mock).mockReturnValue(true);
        (EditorRepository.checkIdExists as jest.Mock).mockReturnValue(false);
        (FormatRepository.checkIdExists as jest.Mock).mockReturnValue(true);
        (BookRepository.insertBook as jest.Mock).mockReturnValue(1);
        const newBook = {
            title: "Harry Potter, tome 1 : Harry Potter à l'école des sorciers",
            isbn: "2070541274",
            authorId: 1,
            editorId: 99999999,
            formatId: 1,
            available: true
        }

        const response = await request(app)
            .post("/book")
            .send(newBook);

        expect(response.body).toEqual({error: ErrorEnum.EDITOR_NOT_FOUND});
        expect(response.status).toBe(404)
    });

    test("create failed, format doesn't exists", async () => {
        (AuthorRepository.checkIdExists as jest.Mock).mockReturnValue(true);
        (EditorRepository.checkIdExists as jest.Mock).mockReturnValue(true);
        (FormatRepository.checkIdExists as jest.Mock).mockReturnValue(false);
        (BookRepository.insertBook as jest.Mock).mockReturnValue(1);
        const newBook = {
            title: "Harry Potter, tome 1 : Harry Potter à l'école des sorciers",
            isbn: "2070541274",
            authorId: 1,
            editorId: 1,
            formatId: 99999999,
            available: true,
        }

        const response = await request(app)
            .post("/book")
            .send(newBook);

        expect(response.body).toEqual({error: ErrorEnum.FORMAT_NOT_FOUND});
        expect(response.status).toBe(404)
    });
})