import { IsbnExceptionsEnum } from "../Enums/IsbnExceptionsEnum";

export const isbnVerify = (isbn: string): boolean|Error => {
    const regex = /[a-zA-Z]/;

    if(isbn.length === 13) {
        const firstField = isbn.substring(0, 3);

        if(firstField !== '978' && firstField !== '979') {
            throw new Error(IsbnExceptionsEnum.INVALID_ISBN13_FIRST_FIELD);
        }

        if(regex.test(isbn)) {
            throw new Error(IsbnExceptionsEnum.INVALID_ISBN13_LETTER);
        }

        if(!validIsbn13(isbn)) {
            throw new Error(IsbnExceptionsEnum.INVALID_ISBN13);
        }
    } else if(isbn.length === 10) {
        if(regex.test(isbn.substring(0, isbn.length - 1))) {
            throw new Error(IsbnExceptionsEnum.INVALID_ISBN_LETTER);
        }

        if (isbn[isbn.length - 1].toLowerCase() !== 'x' && regex.test(isbn[isbn.length - 1])) {
            throw new Error(IsbnExceptionsEnum.INVALID_ISBN_LETTER);
        }

        if(!validIsbn10(isbn)) {
            throw new Error(IsbnExceptionsEnum.INVALID_ISBN);
        }
    } else {
        throw new Error(IsbnExceptionsEnum.INVALID_ISBN_LENGTH);
    }

    return true
}

function validIsbn13(isbn :string ) {
    let multiplicator = 1;
    let sum = 0;
    let countError = 0;
    Array.from(isbn).forEach(num => {
        try {
            sum += parseInt(num) * multiplicator;
            multiplicator = multiplicator === 1 ? 3 : 1;

        } catch (error) {
            countError++;
            if(countError > 1) {
                return false;
            }
        }
    });

    if(sum % 10 != 0) {
        return false;
    }

    return true;
}

function validIsbn10(isbn :string) {
    let sum = 0;
    let multiplicator = 10;
    Array.from(isbn).forEach(num => {
        try {
            if(num.toLowerCase() == 'x') {
                if(multiplicator != 1) { return false; }
                sum += 10;
            } else {
                sum += parseInt(num) * multiplicator;
            }
        } catch (error) {
            return false;
        }
        multiplicator--;
    });

    if(sum % 11 != 0) {
        return false;
    }

    return true;
}

