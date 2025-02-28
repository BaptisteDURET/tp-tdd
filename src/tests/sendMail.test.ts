import request from 'supertest';
import app from "../app";
import { ErrorEnum } from '../Enums/ErrorEnum';

beforeEach(() => {
    jest.resetAllMocks();
});

jest.mock("../repositories/MemberRepository");
jest.mock("../services/MailService");
import MemberRepository from "../repositories/MemberRepository";
import MailService from "../services/MailService";
describe("send mail", () => {
    test("send mail success", async ( ) => {
        (MemberRepository.checkIdExists as jest.Mock).mockReturnValue(true);
        (MemberRepository.getMissedReservationReturn as jest.Mock).mockReturnValue([
            new Reservation(),
            new Reservation(),
        ]);
        (MailService.sendMail as jest.Mock).mockReturnValue(true);

        const response = await request(app)
            .post('/mail/member/1/reservations/missed/')
            .send();
        
        expect(response.body).toEqual({ sent: true });
        expect(response.status).toBe(200);
    });

    test("send mail fail, member doesn't exists", async ( ) => {
        (MemberRepository.checkIdExists as jest.Mock).mockReturnValue(false);
        (MemberRepository.getMissedReservationReturn as jest.Mock).mockReturnValue([
            new Reservation(),
            new Reservation(),
        ]);
        (MailService.sendMail as jest.Mock).mockReturnValue(true);

        const response = await request(app)
            .post('/mail/member/1/reservations/missed/')
            .send();
        
        expect(response.body).toEqual({ error: ErrorEnum.MEMBER_NOT_FOUND });
        expect(response.status).toBe(400);
    });

    test("send mail fail, member doesn't have missed book returns", async ( ) => {
        (MemberRepository.checkIdExists as jest.Mock).mockReturnValue(false);
        (MemberRepository.getMissedReservationReturn as jest.Mock).mockReturnValue([]);
        (MailService.sendMail as jest.Mock).mockReturnValue(true);

        const response = await request(app)
            .post('/mail/member/1/reservations/missed/')
            .send();
        
        expect(response.body).toEqual({ message: MessageEnum.NO_MISSED_RETURN });
        expect(response.status).toBe(200);
    });
});