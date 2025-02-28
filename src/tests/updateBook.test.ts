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

describe("update book", () => {
    test("update success", async () => {
        (AuthorRepository.checkIdExists as jest.Mock).mockReturnValue(true);
        (EditorRepository.checkIdExists as jest.Mock).mockReturnValue(true);
        (BookRepository.checkIdExists as jest.Mock).mockReturnValue(true);
        (FormatRepository.checkIdExists as jest.Mock).mockReturnValue(true);
        (BookRepository.updateBook as jest.Mock).mockReturnValue(true);
        const updatedBook = {
            id: 1,
            title: "Jean Potter, tome 1 : Jean Potter à l'école des sorciers",
            authorId: 1,
            isbn: "2070541274",
            editorId: 1,
            formatId: 1,
            available: true
        }

        const response = await request(app)
            .put("/book")
            .send(updatedBook);

        expect(response.body.updatedBook).toMatchObject(new Book(
            "Jean Potter, tome 1 : Jean Potter à l'école des sorciers",
            "2070541274",
            1,
            1,
            1,
            true
        ));
        expect(response.status).toBe(200);
    });

    test("update failed, missing fields", async () => {
        const updatedBook = {
            title: "Jean Potter, tome 1 : Jean Potter à l'école des sorciers",
            authorId: 1,
            isbn: "2070541274",
            editorId: 1,
        }

        const response = await request(app)
            .put("/book")
            .send(updatedBook);

        expect(response.body).toEqual({error: ErrorEnum.MISSING_FIELDS});
        expect(response.status).toBe(400);
    });

    test("update failed, isbn invalid", async () => {
        const updatedBook = {
            id: 1,
            title: "Jean Potter, tome 1 : Jean Potter à l'école des sorciers",
            isbn: "2970541274",
            authorId: 1,
            editorId: 1,
            formatId: 1,
            available: true
        }

        const response = await request(app)
            .put("/book")
            .send(updatedBook);

        expect(response.body).toEqual({error: ErrorEnum.ISBN_INVALID});
        expect(response.status).toBe(400);
    });

    test("update failed, isbn too long", async () => {
        const updatedBook = {
            id: 1,
            title: "Jean Potter, tome 1 : Jean Potter à l'école des sorciers",
            isbn: "20705412744",
            authorId: 1,
            editorId: 1,
            formatId: 1,
            available: true
        }

        const response = await request(app)
            .put("/book")
            .send(updatedBook);

        expect(response.body).toEqual({error: IsbnExceptionsEnum.INVALID_ISBN_LENGTH});
        expect(response.status).toBe(400)
    });


    test("update failed, author doesn't exists", async () => {
        (AuthorRepository.checkIdExists as jest.Mock).mockReturnValue(false);
        (EditorRepository.checkIdExists as jest.Mock).mockReturnValue(true);
        (FormatRepository.checkIdExists as jest.Mock).mockReturnValue(true);
        (BookRepository.checkIdExists as jest.Mock).mockReturnValue(true);
        (BookRepository.insertBook as jest.Mock).mockReturnValue(1);
        const updatedBook = {
            id: 1,
            title: "Jean Potter, tome 1 : Jean Potter à l'école des sorciers",
            isbn: "2070541274",
            authorId: 99999999,
            editorId: 1,
            formatId: 1,
            available: true
        }

        const response = await request(app)
            .put("/book")
            .send(updatedBook);

        expect(response.body).toEqual({error: ErrorEnum.AUTHOR_NOT_FOUND});
        expect(response.status).toBe(404)
    });

    test("update failed, editor doesn't exists", async () => {
        (AuthorRepository.checkIdExists as jest.Mock).mockReturnValue(true);
        (EditorRepository.checkIdExists as jest.Mock).mockReturnValue(false);
        (FormatRepository.checkIdExists as jest.Mock).mockReturnValue(true);
        (BookRepository.checkIdExists as jest.Mock).mockReturnValue(true);
        (BookRepository.insertBook as jest.Mock).mockReturnValue(1);
        const updatedBook = {
            id: 1,
            title: "Jean Potter, tome 1 : Jean Potter à l'école des sorciers",
            isbn: "2070541274",
            authorId: 1,
            editorId: 99999999,
            formatId: 1,
            available: true
        }

        const response = await request(app)
            .put("/book")
            .send(updatedBook);

        expect(response.body).toEqual({error: ErrorEnum.EDITOR_NOT_FOUND});
        expect(response.status).toBe(404)
    });

    test("update failed, format doesn't exists", async () => {
        (AuthorRepository.checkIdExists as jest.Mock).mockReturnValue(true);
        (EditorRepository.checkIdExists as jest.Mock).mockReturnValue(true);
        (FormatRepository.checkIdExists as jest.Mock).mockReturnValue(false);
        (BookRepository.checkIdExists as jest.Mock).mockReturnValue(true);
        (BookRepository.insertBook as jest.Mock).mockReturnValue(1);
        const updatedBook = {
            id: 1,
            title: "Jean Potter, tome 1 : Jean Potter à l'école des sorciers",
            isbn: "2070541274",
            authorId: 1,
            editorId: 1,
            formatId: 99999999,
            available: true,
        }

        const response = await request(app)
            .put("/book")
            .send(updatedBook);

        expect(response.body).toEqual({error: ErrorEnum.FORMAT_NOT_FOUND});
        expect(response.status).toBe(404)
    });

    test("update failed, book doesn't exists", async () => {
        (AuthorRepository.checkIdExists as jest.Mock).mockReturnValue(true);
        (EditorRepository.checkIdExists as jest.Mock).mockReturnValue(true);
        (FormatRepository.checkIdExists as jest.Mock).mockReturnValue(true);
        (BookRepository.checkIdExists as jest.Mock).mockReturnValue(false);
        (BookRepository.insertBook as jest.Mock).mockReturnValue(1);
        const updatedBook = {
            id: 9999999,
            title: "Jean Potter, tome 1 : Jean Potter à l'école des sorciers",
            isbn: "2070541274",
            authorId: 1,
            editorId: 1,
            formatId: 1,
            available: true,
        }

        const response = await request(app)
            .put("/book")
            .send(updatedBook);

        expect(response.body).toEqual({error: ErrorEnum.BOOK_NOT_FOUND});
        expect(response.status).toBe(404)
    });
})