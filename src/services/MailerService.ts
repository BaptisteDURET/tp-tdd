import Reservation from "../models/Reservation";

class MailerService {
    public static sendMail(reservations: Reservation[]) {
        if(reservations.length <= 0) {
            return false;
        }

        try {
            // TO DO send mail
            return true;
        } catch (error: unknown) {
            return false
        }
    }
}

export default MailerService;