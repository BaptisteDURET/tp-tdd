class Book {
    title: string;
    isbn: string;
    available: boolean;
    authorId: number;
    editorId: number;
    formatId: number;

    constructor(
        title: string,
        isbn: string,
        authorId: number,
        editorId: number,
        formatId: number,
        available: boolean,
    ) {
        this.title = title;
        this.isbn = isbn;
        this.available = available;
        this.authorId = authorId;
        this.editorId = editorId;
        this.formatId = formatId;
    }
}

export default Book;