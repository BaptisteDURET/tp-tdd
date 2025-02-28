import request from 'supertest';
import app from "../app";
import { ErrorEnum } from '../Enums/ErrorEnum';

beforeEach(() => {
    jest.resetAllMocks();
});


jest.mock("../repositories/ReservationRepository");
jest.mock("../repositories/StatusRepository")
import ReservationRepository from '../repositories/ReservationRepository';
import StatusRepository from '../repositories/StatusRepository';

describe("ask reservation", () => {

    test("update success", async ( )=> {
        (ReservationRepository.updateReservation as jest.Mock).mockReturnValue(true);
        (ReservationRepository.checkIdExists as jest.Mock).mockReturnValue(true);
        (StatusRepository.checkIdExists as jest.Mock).mockReturnValue(true);

        const reservation = {
            idReservation: 1,
            statusId: 2,
        }

        const response = await request(app)
            .put('/reservation')
            .send(reservation);

        expect(response.body).toEqual({ updated: true });
        expect(response.status).toBe(200);
    });

    test("update fail, reservation doesn't exists", async ( )=> {
        (ReservationRepository.updateReservation as jest.Mock).mockReturnValue(true);
        (ReservationRepository.checkIdExists as jest.Mock).mockReturnValue(false);
        (StatusRepository.checkIdExists as jest.Mock).mockReturnValue(true);

        const reservation = {
            idReservation: 9999999,
            statusId: 2,
        }

        const response = await request(app)
            .put('/reservation')
            .send(reservation);

        expect(response.body).toEqual({ error: ErrorEnum.RESERVATION_NOT_FOUND });
        expect(response.status).toBe(400);
    });

    test("update fail, status doesn't exists", async ( )=> {
        (ReservationRepository.updateReservation as jest.Mock).mockReturnValue(true);
        (ReservationRepository.checkIdExists as jest.Mock).mockReturnValue(true);
        (StatusRepository.checkIdExists as jest.Mock).mockReturnValue(false);

        const reservation = {
            idReservation: 1,
            statusId: 9999999999999999999,
        }

        const response = await request(app)
            .put('/reservation')
            .send(reservation);

        expect(response.body).toEqual({ error : ErrorEnum.STATUS_NOT_FOUND });
        expect(response.status).toBe(400);
    });

    test("update fail, missing fields", async ( )=> {
        const reservation = {
            idReservation: 1,
        }

        const response = await request(app)
            .put('/reservation')
            .send(reservation);

        expect(response.body).toEqual({ error: ErrorEnum.MISSING_FIELDS });
        expect(response.status).toBe(400);
    });
});