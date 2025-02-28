import request from 'supertest';
import app from "../app";
import { ErrorEnum } from '../Enums/ErrorEnum';
import { MessageEnum } from '../Enums/MessageEnum';

beforeEach(() => {
    jest.resetAllMocks();
});

jest.mock("../repositories/MemberRepository");
jest.mock("../services/MailerService");
import MemberRepository from '../repositories/MemberRepository';
import MailerService from "../services/MailerService";
import Reservation from '../models/Reservation';
describe("send mail", () => {
    test("send mail success", async ( ) => {
        (MemberRepository.checkIdExists as jest.Mock).mockReturnValue(true);
        (MemberRepository.getMissedReservationReturn as jest.Mock).mockReturnValue([
            new Reservation(),
            new Reservation(),
        ]);
        (MailerService.sendMail as jest.Mock).mockReturnValue(true);

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
        (MailerService.sendMail as jest.Mock).mockReturnValue(true);

        const response = await request(app)
            .post('/mail/member/1/reservations/missed/')
            .send();
        
        expect(response.body).toEqual({ error: ErrorEnum.MEMBER_NOT_FOUND });
        expect(response.status).toBe(400);
    });

    test("send mail fail, member doesn't have missed book returns", async ( ) => {
        (MemberRepository.checkIdExists as jest.Mock).mockReturnValue(false);
        (MemberRepository.getMissedReservationReturn as jest.Mock).mockReturnValue([]);
        (MailerService.sendMail as jest.Mock).mockReturnValue(true);

        const response = await request(app)
            .post('/mail/member/1/reservations/missed/')
            .send();
        
        expect(response.body).toEqual({ message: MessageEnum.NO_MISSED_RETURN });
        expect(response.status).toBe(200);
    });
});