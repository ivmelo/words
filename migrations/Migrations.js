import {
    SQLite
} from 'expo';

class Migrations {
    databaseName = 'words';

    async run () {
        
        // console.log(await this.getVersion());
        // await this.incrementVersion();
        // console.log(await this.getVersion());
        // this.migrate_to_0();
        
        let version = await this.getVersion();

        if (version === null) {
            version = 0;
        } else {
            version++;
        }
        
        while (this['migrate_to_' + version] !== 'undefined') {
            console.log(this['migrate_to_' + version]);
        }

        console.log();
    }

    async migrate_to_0() {
        let sql1 = `
            CREATE TABLE IF NOT EXISTS migrations (
                id INTEGER PRIMARY KEY NOT NULL, 
                version INTEGER NOT NULL, 
                date INTEGER NOT NULL
            );
        `;

        let sql2 = `
            INSERT INTO migrations (version, date) VALUES (?, ?);
        `;

        let data2 = [0, new Date().getTime()];

        console.log(data2);

        

        // await ()

        // console.log(q1);

        // let date = new Date().getTime();

        // let q2 = `
        //     INSERT INTO migrations (version) VALUES (0);
        // `;

        // console.log(q2);
    }

    async migrate_to_1() {
        let sql = `
            CREATE TABLE IF NOT EXISTS COMPANY(
                id INT PRIMARY KEY NOT NULL,
                version TEXT NOT NULL,
                AGE INT NOT NULL,
                ADDRESS CHAR(50),
                SALARY REAL
            );

            create table if not exists items (id integer primary key not null, entry text not null, date integer not null, created_at integer not null, updated_at integer not null)
        `;
    }

    async migrate_to_2() {

    }

    /**
     * Gets the current version of the migration.
     */
    async getVersion() {
        let version = null;

        let query = 'SELECT * FROM migrations ORDER BY ID DESC LIMIT 1';

        try {
            let results = await this.executeSql(query, []);
            if (results.rows._array.length) {
                return results.rows._array[0].version;  
            }
        } catch (err) {
            return null;
        }
        return null;
    }

    /**
     * Increments the migration version.
     */
    async incrementVersion() {
        let version = await this.getVersion();

        if (version !== null) {
            version++;
        }

        return this.executeSql(
            'INSERT INTO migrations (version, date) VALUES (?, ?)', 
            [version, new Date().getTime()]
        );
    }

    /**
     * Runs a SQLite query.
     * 
     * @param {string} sql 
     * @param {array} data 
     * @return {Promise}
     */
    async executeSql(sql, data = []) {
        let db = SQLite.openDatabase(this.databaseName + '.sqlite');

        return new Promise(async (resolve, reject) => {
            await db.transaction(async (tx) => {
                await tx.executeSql(
                    sql,
                    data,
                    (tx, res) => {
                        resolve(res);
                    }, (error) => {
                        reject(err);
                    }
                );
            });
        })
    }
}

export default Migrations;