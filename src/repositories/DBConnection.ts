

import { MySqlConnection } from 'ts-sql-query/connections/MySqlConnection';
import { createPool } from 'mysql';
import { ConsoleLogQueryRunner } from 'ts-sql-query/queryRunners/ConsoleLogQueryRunner'
import { MySqlPoolQueryRunner } from 'ts-sql-query/queryRunners/MySqlPoolQueryRunner'
import { Table } from 'ts-sql-query/Table'

class DBConnection extends MySqlConnection<'DBConnection'> {
	protected uuidStrategy = 'string' as const
    protected compatibilityMode = true

    increment(i: number) {
        return this.executeFunction('increment', [this.const(i, 'int')], 'int', 'required')
    }
    
    public static getConnection() {
        return new DBConnection(new ConsoleLogQueryRunner(new MySqlPoolQueryRunner(
            createPool({
                connectionLimit: 10,
                host: 'localhost',
                user: 'root',
                password: 'my-secret-pw',
                database: 'library'
            })
        )))
    }
}

const tBook = new class TBook extends Table<DBConnection, 'TBook'> {
    id = this.autogeneratedPrimaryKey('id', 'int');
    title = this.column('title', 'string');
    isbn = this.column('isbn', 'string');
    available = this.column('available', 'boolean');
    authorId = this.column('authorId', 'int');
    editorId = this.column('editorId', 'int');
    formatId = this.column('formatId', 'int');
    constructor() {
        super('book'); // table name in the database
    }
}()

const tAuthor = new class TBook extends Table<DBConnection, 'tAuthor'> {
    id = this.autogeneratedPrimaryKey('id', 'int');
    title = this.column('firstName', 'string');
    isbn = this.column('lastName', 'string');
    constructor() {
        super('author'); // table name in the database
    }
}()

const tEditor = new class TBook extends Table<DBConnection, 'tEditor'> {
    id = this.autogeneratedPrimaryKey('id', 'int');
    title = this.column('name', 'string');
    constructor() {
        super('editor'); // table name in the database
    }
}()

const tFormat = new class TBook extends Table<DBConnection, 'tFormat'> {
    id = this.autogeneratedPrimaryKey('id', 'int');
    title = this.column('libel', 'string');
    constructor() {
        super('format'); // table name in the database
    }
}()

export default { DBConnection, tBook, tFormat, tEditor, tAuthor };