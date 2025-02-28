import { ErrorEnum } from "../Enums/ErrorEnum";
import app from "../app";
import request from 'supertest';

jest.mock("../repositories/BookRepository");
import BookRepository from "../repositories/BookRepository";

beforeEach(() => {
    jest.resetAllMocks();
});

describe("delete book", () => {
    test("Delete success", async () => {
        (BookRepository.deleteBook as jest.Mock).mockReturnValue(true);
        const response = await request(app)
            .delete('/book')
            .send({ id: 1 })
        
        expect(response.body).toEqual({ deleted: true });
        expect(response.status).toBe(200);
    })

    test("Delete fail, book doesn't exists", async () => {
        (BookRepository.deleteBook as jest.Mock).mockReturnValue(false);
        const response = await request(app)
            .delete('/book')
            .send({ id: 999999999999 });
        
        expect(response.body).toEqual({ error: ErrorEnum.BOOK_NOT_FOUND });
        expect(response.status).toBe(400);
    })
});