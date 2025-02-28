import DBConnection from "./DBConnection";

class EditorRepository {
    static connection = DBConnection.DBConnection.getConnection();

    public static checkIdExists(id: number) {
        return this.connection.selectFrom(DBConnection.tEditor)
            .where(DBConnection.tEditor.id.equals(id))
            .select({
                id: DBConnection.tEditor.id,
            }).executeSelectOne() != null;
    }
}

export default EditorRepository;