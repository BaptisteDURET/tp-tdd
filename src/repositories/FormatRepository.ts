import DBConnection from "./DBConnection";

class FormatRepository {
    static connection = DBConnection.DBConnection.getConnection();

    public static checkIdExists(id: number) {
        return this.connection.selectFrom(DBConnection.tFormat)
            .where(DBConnection.tFormat.id.equals(id))
            .select({
                id: DBConnection.tFormat.id,
            }).executeSelectOne() != null;
    }
}

export default FormatRepository;