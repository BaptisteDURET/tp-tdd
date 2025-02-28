import request from 'supertest';
import app from "../app";
import { ErrorEnum } from '../Enums/ErrorEnum';

beforeEach(() => {
    jest.resetAllMocks();
});

jest.mock("../repositories/MemberRepository");
import MemberRepository from "../repositories/MemberRepository";
describe("get reservation from member", () => {
    test("get success", async ( )=> {
        (MemberRepository.checkIdExists as jest.Mock).mockReturnValue(true);
        (MemberRepository.getMissedReservationReturn as jest.Mock).mockReturnValue([
            new Reservation(),
            new Reservation(),
        ]);

        const response = await request(app)
            .get('/member/1/reservations/missed')
            .send();
        
        expect(response.body).toHaveProperty(reservations);
        expect(response.body.reservations).toBeInstanceOf(Array);
        expect(response.status).toBe(200);
    });

    test("get fail, member doesn't exists", async ( ) => {
        (MemberRepository.checkIdExists as jest.Mock).mockReturnValue(false);

        const response = await request(app)
        .get('/member/1/reservations/missed')
        .send();
    
        expect(response.body).toEqual({ error: ErrorEnum.MEMBER_NOT_FOUND });
        expect(response.status).toBe(400);
    });
});