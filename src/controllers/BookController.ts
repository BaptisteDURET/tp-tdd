import { Request, Response } from 'express';
import Book from "../models/Book";
import { ErrorEnum } from '../Enums/ErrorEnum';
import { isbnVerify } from '../services/IsbnService';
import { IsbnExceptionsEnum } from '../Enums/IsbnExceptionsEnum';
import BookRepository from '../repositories/BookRepository';
import AuthorRepository from '../repositories/AuthorRepository';
import EditorRepository from '../repositories/EditorRepository';
import FormatRepository from '../repositories/FormatRepository';

export const createBook = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, isbn, authorId, editorId, formatId, available } = req.body;

        if(!title || !isbn || !authorId || !editorId || !formatId || typeof available != "boolean") {
            throw new Error(ErrorEnum.MISSING_FIELDS);
        }

        isbnVerify(isbn);
        if(!AuthorRepository.checkIdExists(authorId)) {
            res.status(404).json({error: ErrorEnum.AUTHOR_NOT_FOUND});
        }else if(!EditorRepository.checkIdExists(editorId)) {
            res.status(404).json({error: ErrorEnum.EDITOR_NOT_FOUND});
        }else if(!FormatRepository.checkIdExists(formatId)) {
            res.status(404).json({error: ErrorEnum.FORMAT_NOT_FOUND});
        }else {

            const newBook = new Book(title, isbn, authorId, editorId, formatId, available);
            const id = BookRepository.insertBook(newBook);

            res.status(201).json({ newBook, id })
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            if(Object.values(IsbnExceptionsEnum).includes(error.message as IsbnExceptionsEnum) && error.message != IsbnExceptionsEnum.INVALID_ISBN_LENGTH) {
                res.status(400).json({error: ErrorEnum.ISBN_INVALID});
            } else {
                res.status(400).json({ error: error.message })
            }
        } else {
            res.status(400).json({ error: ErrorEnum.UNEXPECTED_ERROR })
        }
    }
}

export const updateBook = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id, title, isbn, authorId, editorId, formatId, available } = req.body;

        if(!id || !title || !isbn || !authorId || !editorId || !formatId || typeof available != "boolean") {
            throw new Error(ErrorEnum.MISSING_FIELDS);
        }

        isbnVerify(isbn);
        if(!BookRepository.checkIdExists(id)) {
            res.status(404).json({error: ErrorEnum.BOOK_NOT_FOUND});
        }else if(!EditorRepository.checkIdExists(editorId)) {
            res.status(404).json({error: ErrorEnum.EDITOR_NOT_FOUND});
        }else if(!FormatRepository.checkIdExists(formatId)) {
            res.status(404).json({error: ErrorEnum.FORMAT_NOT_FOUND});
        }else if(!AuthorRepository.checkIdExists(authorId)) {
            res.status(404).json({error: ErrorEnum.AUTHOR_NOT_FOUND});
        }else {
            const updatedBook = new Book(title, isbn, authorId, editorId, formatId, available);
            if(await BookRepository.updateBook(updatedBook, id)) {
                res.status(200).json({ updatedBook, id })
            }
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            if(Object.values(IsbnExceptionsEnum).includes(error.message as IsbnExceptionsEnum) && error.message != IsbnExceptionsEnum.INVALID_ISBN_LENGTH) {
                res.status(400).json({error: ErrorEnum.ISBN_INVALID});
            } else {
                res.status(400).json({ error: error.message })
            }
        } else {
            res.status(400).json({ error: ErrorEnum.UNEXPECTED_ERROR })
        }
    }
}

export const deleteBook = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.body;

        if(!id) {
            throw new Error(ErrorEnum.MISSING_FIELDS);
        }

        if(!BookRepository.checkIdExists(id)) {
            throw new Error(ErrorEnum.BOOK_NOT_FOUND);
        }
        if(await BookRepository.deleteBook(id)) {
            res.status(200).send({ deleted: true })
        } else {
            res.status(200).send({ deleted: false })
        }
    } catch(error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message })
        } else {
            res.status(400).json({ error: ErrorEnum.UNEXPECTED_ERROR })
        }
    }
}