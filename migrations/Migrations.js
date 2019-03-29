import SimpleMigrations from "./SimpleMigrations";

class Migrations extends SimpleMigrations {

    /**
     * First migration method. Creates the entries table.
     */
    static async migrate_to_1() {
        let sql = `
            CREATE TABLE IF NOT EXISTS entries (
                id INTEGER PRIMARY KEY NOT NULL, 
                entry TEXT NOT NULL, 
                date INTEGER NOT NULL, 
                created_at INTEGER NOT NULL, 
                updated_at INTEGER NOT NULL
            );
        `;

        try {
            await this.executeSql(sql);
        } catch (error) {
            return false;
        }

        return true;
    }
}

export default Migrations;