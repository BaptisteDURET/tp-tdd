import request from 'supertest';
import app from "../app";
import { ErrorEnum } from '../Enums/ErrorEnum';

beforeEach(() => {
    jest.resetAllMocks();
});


jest.mock("../repositories/BookRepository");
jest.mock("../repositories/ReservationRepository");
jest.mock("../repositories/MemberRepository");
import BookRepository from "../repositories/BookRepository";
import ReservationRepository from "../repositories/ReservationRepository";
import MemberRepository from "../repositories/MemberRepository";

describe("ask reservation", () => {

    test("ask reservation success", async () => {
        (BookRepository.checkIdExists as jest.Mock).mockReturnValue(true);
        (MemberRepository.checkIdExists as jest.Mock).mockReturnValue(true);
        (ReservationRepository.insertReservation as jest.Mock).mockReturnValue(1);
        (BookRepository.isAvailable as jest.Mock).mockReturnValue(true);
        (MemberRepository.getActiveRservations as jest.Mock).mockReturnValue(1);

        const reservation = {
            idBook: 1,
            idMember: 1,
        }

        const response = await request(app)
            .post('/reservation')
            .send(reservation);
        
        expect(response.body.idBook).toEqual(reservation.idBook);
        expect(response.body.idMemeber).toEqual(reservation.idMember);
        expect(response.body.idStatus).toEqual(1);
        expect(response.body).toHaveProperty("returnLimit");
        expect(response.status).toBe(201);
    });

    test("ask reservation fail, missing fields", async () => {
        const reservation = {
            idBook: 1,
        }

        const response = await request(app)
            .post('/reservation')
            .send(reservation);
        
        expect(response.body).toEqual({ error: ErrorEnum.MISSING_FIELDS })
        expect(response.status).toBe(400)
    });

    test("ask reservation fail, book doesn't exists", async () => {
        (BookRepository.checkIdExists as jest.Mock).mockReturnValue(false);
        (MemberRepository.checkIdExists as jest.Mock).mockReturnValue(true);
        (BookRepository.isAvailable as jest.Mock).mockReturnValue(true);
        (MemberRepository.getActiveRservations as jest.Mock).mockReturnValue(1);

        const reservation = {
            idBook: 99999999,
            idMember: 1,
        }

        const response = await request(app)
            .post('/reservation')
            .send(reservation);
        
        expect(response.body.idBook).toEqual(reservation.idBook);
        expect(response.body.idMemeber).toEqual(reservation.idMember);
        expect(response.body.idStatus).toEqual(1);
        expect(response.body).toHaveProperty("returnLimit");
        expect(response.status).toBe(201);
    });

    test("ask reservation fail, book is not available", async () => {
        (BookRepository.checkIdExists as jest.Mock).mockReturnValue(true);
        (MemberRepository.checkIdExists as jest.Mock).mockReturnValue(true);
        (BookRepository.isAvailable as jest.Mock).mockReturnValue(false);
        (MemberRepository.getActiveRservations as jest.Mock).mockReturnValue(1);

        const reservation = {
            idBook: 1,
            idMember: 1,
        }

        const response = await request(app)
            .post('/reservation')
            .send(reservation);

        expect(response.body).toEqual({ error: ErrorEnum.BOOK_NOT_AVAILABLE });
        expect(response.status).toBe(400);
    });

    test("ask reservation fail, memeber already has 3 reservation", async () => {
        (BookRepository.checkIdExists as jest.Mock).mockReturnValue(true);
        (MemberRepository.checkIdExists as jest.Mock).mockReturnValue(true);
        (BookRepository.isAvailable as jest.Mock).mockReturnValue(true);
        (MemberRepository.getActiveRservations as jest.Mock).mockReturnValue(3);

        const reservation = {
            idBook: 1,
            idMember: 1,
        }

        const response = await request(app)
            .post('/reservation')
            .send(reservation);

        expect(response.body).toEqual({ error: ErrorEnum.TOO_MANY_RESERVATIONS });
        expect(response.status).toBe(400);
    });

    test("ask reservation fail, library member doesn't exists", async () => {
        (BookRepository.checkIdExists as jest.Mock).mockReturnValue(true);
        (MemberRepository.checkIdExists as jest.Mock).mockReturnValue(false);
        (BookRepository.isAvailable as jest.Mock).mockReturnValue(true);
        (MemberRepository.getActiveRservations as jest.Mock).mockReturnValue(1);

        const reservation = {
            idBook: 1,
            idMember: 99999999,
        }

        const response = await request(app)
            .post('/reservation')
            .send(reservation);

        expect(response.body).toEqual({ error: ErrorEnum.MEMBER_NOT_FOUND });
        expect(response.status).toBe(400);
    });
});