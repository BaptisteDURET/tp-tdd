import DBConnection from "./DBConnection";

class AuthorRepository {
    static connection = DBConnection.DBConnection.getConnection();

    public static checkIdExists(id: number) {
        return this.connection.selectFrom(DBConnection.tAuthor)
            .where(DBConnection.tAuthor.id.equals(id))
            .select({
                id: DBConnection.tAuthor.id,
            }).executeSelectOne() != null;
    }
}

export default AuthorRepository;