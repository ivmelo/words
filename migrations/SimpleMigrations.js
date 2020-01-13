import * as SQLite from 'expo-sqlite';

class SimpleMigrations {
    /**
     * Must be ovewriten.
     */
    static databaseName() {
        return 'words';
    }

    /**
     * Run the migrations.
     */
    static async run() {
        // let res = await this.executeSql(`drop table migrations`);
        // console.log(res);

        // Gets the current version.
        let currentVersion = await this.getVersion();

        console.log('Current DB version: ' + currentVersion);

        // If null, no migration table is present. Set version to 0 to create it.
        if (currentVersion === null) {
            currentVersion = 0;
        } else {
            currentVersion++;
        }

        // Loop through migration methods and execute them.
        // The first one sets up the migrations table.
        while (typeof this['migrate_to_' + currentVersion] === 'function') {
            console.log('Migrating to: ' + currentVersion);
            let res = await this['migrate_to_' + currentVersion]();
            if (res) {
                await this.setVersion(currentVersion);
                console.log('Migrated to: ' + currentVersion);
            } else {
                return false;
            }
            currentVersion++;
        }

        return true;
    }
    

    /**
     * Set up migrations table, add initial record.
     */
    static async migrate_to_0() {
        let sql = `
            CREATE TABLE IF NOT EXISTS migrations (
                id INTEGER PRIMARY KEY NOT NULL,
                version INTEGER NOT NULL,
                date INTEGER NOT NULL
            );
        `;

        try {
            await this.executeSql(sql);
        } catch (error) {
            return false;
        }

        return true;
    }

    /**
     * Gets the latest database version number.
     */
    static async getVersion() {
        let sql = `
            SELECT * FROM migrations ORDER BY date DESC LIMIT 1;
        `;

        try {
            let result = await this.executeSql(sql);
            return result.rows._array[0].version;
        } catch (error) {
            return null;
        }
    }

    /**
     * Sets the database version number.
     * 
     * @param {Number} version 
     */
    static async setVersion(version) {
        let sql = `
            INSERT INTO migrations (version, date) VALUES (?, ?);
        `;

        let data = [version, new Date().getTime()];

        try {
            await this.executeSql(sql, data);
        } catch (error) {
            return false;
        }

        return true;
    }

    /**
     * Runs some SQL code. Can also pass params for safe queries.
     * 
     * @param {String} sql 
     * @param {Array} params 
     * @returns {Promise}
     */
    static async executeSql(sql, params = []) {
        let db = SQLite.openDatabase(this.databaseName() + '.sqlite');

        return new Promise((resolve, reject) => {
            db.transaction(async (tx) => {
                tx.executeSql(
                sql,
                params,
                (tx, res) => {
                    resolve(res);
                }, (error) => {
                    reject(error);
                });
            });
        });
    }
    
    /**
     * First migration method. Creates the entries table.
     */
    static async wipeDatabase() {
        let sql = `
            SELECT * FROM sqlite_master WHERE type = 'table';
        `;

        try {
            let results = await this.executeSql(sql);

            results.rows._array.forEach(async (element) => {
                if (element.name != 'android_metadata') {
                    await this.executeSql('drop table if exists ' + element.name);
                }
            });

            // console.log(results.rows._array);

        } catch (error) {
            return false;
        }

        return true;
    }
}

export default SimpleMigrations;
