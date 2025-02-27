import { isbnVerify } from "../services/IsbnService";
import { IsbnExceptionsEnum } from "../Enums/isbnExceptionsEnum";



describe("tests ISBN 10", () => {
    test("ISBN 10 valid", () => {
        expect(isbnVerify("0739330713")).toBe(true);
    });

    test("ISBN 10 valid with X", () => {
        expect(isbnVerify("012000030X")).toBe(true);
    });

    test("ISBN 10 invalid with letters", () => { 
        expect(() => isbnVerify("2070ff1277")).toThrow(Error(IsbnExceptionsEnum.INVALID_ISBN_LETTER));
    });
    
    test("ISBN 10 invalid with X at the wrong place", () => {
        expect(() => isbnVerify("20704512X7")).toThrow(Error(IsbnExceptionsEnum.INVALID_ISBN_LETTER));
    });

    test("ISBN 10 invalid format", () => {
        expect(() => isbnVerify("207045127X")).toThrow(Error(IsbnExceptionsEnum.INVALID_ISBN));
    });
});

describe("tests ISBN 13", () => {
    test("ISBN 13 valid", () => {
        expect(isbnVerify("9781234567897")).toBe(true);
    });

    test("ISBN 13 invalid length first field", () => {
        expect(() => isbnVerify("9721834567897")).toThrow(IsbnExceptionsEnum.INVALID_ISBN13_FIRST_FIELD);
    });

    test("ISBN 13 invalid with letter", () => {
        expect(() => isbnVerify("978123456789f")).toThrow(Error(IsbnExceptionsEnum.INVALID_ISBN13_LETTER));
    });

    test("ISBN 13 invalid format", () => {
        expect(() => isbnVerify("9781234567894")).toThrow(Error(IsbnExceptionsEnum.INVALID_ISBN13));
    });
});