import { ErrorEnum } from "../Enums/ErrorEnum";
import Book from "../models/Book";
import DBConnection from "./DBConnection";

class BookRepository {
    tableName : String = "Book";
    static connection = DBConnection.DBConnection.getConnection();

    public static insertBook(book: Book) {
        try {
            return this.connection.insertInto(DBConnection.tBook).set({
                title: book.title,
                isbn: book.isbn,
                available: book.available,
                authorId: book.authorId,
                editorId: book.editorId,
                formatId: book.formatId
            }).returningLastInsertedId().executeInsert();
        } catch (error: unknown) {
            throw new Error(ErrorEnum.UNEXPECTED_ERROR);
        }
    }

    public static checkIdExists(id: number) {
        return this.connection.selectFrom(DBConnection.tBook)
            .where(DBConnection.tBook.id.equals(id))
            .select({
                id: DBConnection.tBook.id,
            }).executeSelectOne() != null;
    }

    public static deleteBook(id: number) {
        try{
            return this.connection.deleteFrom(DBConnection.tBook)
            .where(DBConnection.tBook.id.equals(id))
            .executeDelete()
        } catch(error: unknown) {
            throw new Error(ErrorEnum.UNEXPECTED_ERROR);
        }
    }

    public static async updateBook(book: Book, id: number) {
        try {
            await this.connection.update(DBConnection.tBook)
                .set({
                    title: book.title,
                    isbn: book.isbn,
                    available: book.available,
                    authorId: book.authorId,
                    editorId: book.editorId,
                    formatId: book.formatId
                }).where(DBConnection.tBook.id.equals(id))
                .executeUpdate()
            return true;
        } catch(error: unknown) {
            throw new Error(ErrorEnum.UNEXPECTED_ERROR)
        }
    }
}

export default BookRepository;