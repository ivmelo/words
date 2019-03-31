import {
    SQLite
} from 'expo';

import SimpleQuery from './SimpleQuery';

export default class SimpleModel {

    constructor() {
        this.id = null;
        this.created_at = null;
        this.updated_at = null;
    }

    /**
     * Must override DB name.
     */
    static databaseName() {
        return ''; // Must override DB Name.
    }

    /**
     * Must override table name.
     */
    static tableName() {
        return '';
    }

    /**
     * The fields that will become Date() instances.
     */
    static dateFields() {
        return ['created_at', 'updated_at'];
    }

    /**
     * The fields that hold other Simple Model instances.
     */
    static modelFields() {
        return [];
    }

    /**
     * Deletes a record from the database.
     */
    async destroy() {
        let db = SQLite.openDatabase(this.constructor.databaseName() + '.sqlite');

        return new Promise((resolve, reject) => {
            db.transaction(async (tx) => {
                tx.executeSql(
                    'delete from ' + this.constructor.tableName() + ' where id = ?',
                    [this.id], 
                    (tx, res) => {
                        resolve(res);
                    }, (error) => {
                        reject(error);
                    });
            });
        });
    }

    /**
     * Saves the current model in the database.
     */
    async save() {
        let properties = Object.getOwnPropertyNames(this);
        let dateFields = this.constructor.dateFields();
        let values = [];
        let placeholders = [];
        let query = '';

        // Get rid of primary key, will be created by the DB.
        properties.splice(properties.indexOf('id'), 1);

        // Convert date objects to timestamps to be stored in the database.
        properties.forEach(property => {
            if (dateFields.indexOf(property) !== -1) {
                let timestamp = this[property].getTime();
                values.push(timestamp);
                console.log(timestamp);
            } else {
                values.push(this[property]);
            }
            placeholders.push('?');
        });

        // If there's no ID, then the record is being inserted.
        if (this.id === null) {
            query = 'insert into ' + this.constructor.tableName() + ' (' + properties.join(', ') + ') values (' + placeholders.join(', ') + ')';
        } else {
            query = 'update ' + this.constructor.tableName() + ' set ' + properties.join(' = ?, ') + ' = ? where id = ?'; // Primary key.
            values.push(this.id);
        }

        // The usual DB stuff.
        let db = SQLite.openDatabase(this.constructor.databaseName() + '.sqlite');

        // Save everything and return a promise.
        return new Promise((resolve, reject) => {
            db.transaction(async (tx) => {
                tx.executeSql(
                    query,
                    values,
                    (tx, res) => {
                        if (this.id === null) {
                            this.id = res.insertId;
                        }
                        resolve(res);
                    }, (error) => {
                        reject(error);
                    }
                );
            });
        });
    }

    /**
     * Gets all records.
     */
    static async all(sort_field = 'id', sort_order = 'ASC') {
        let db = SQLite.openDatabase(this.databaseName() + '.sqlite');

        let query = 'select * from ' + this.tableName();

        query += ' order by ' + sort_field;
        if (sort_order == 'DESC') {
            query += ' DESC';
        }

        return new Promise((resolve, reject) => {
            db.transaction(async (tx) => {
                tx.executeSql(
                    query, [], (tx, res) => {
                        let results = [];
                        if (res.rows._array.length) {
                            res.rows._array.forEach(data => {
                                results.push(new this.prototype.constructor(data));
                            });
                        }
                        resolve(results);
                    }, (error) => {
                        reject(error);
                    });

            });
        });
    };

    /**
     * Gets a specified record by its id.
     */
    static async find(id) {
        let db = SQLite.openDatabase(this.databaseName() + '.sqlite');

        return new Promise((resolve, reject) => {
            db.transaction(async (tx) => {
                tx.executeSql(
                    'select * from ' + this.tableName() + ' where id = ?', [id], (tx, res) => {
                        console.log(res.rows.length);
                        if (res.rows.length) {
                            let data = res.rows._array[0]; // record;

                            this.dateFields().forEach((dateField) => {
                                if (data[dateField]) {
                                    data[dateField] = new Date(data[dateField]);
                                }
                            });

                            resolve(new this.prototype.constructor(data));
                        } else {
                            resolve(null);
                        }
                        resolve(res.rows._array);
                    }, (error) => {
                        reject(error);
                    });
            });
        });
    };

    /**
     * Destroy all records of the current type.
     */
    static async destroyAll() {
        let db = SQLite.openDatabase(this.databaseName() + '.sqlite');

        return new Promise((resolve, reject) => {
            db.transaction(async (tx) => {
                tx.executeSql(
                    'delete from ' + this.tableName(),
                    [],
                    (tx, res) => {
                        resolve(res);
                    }, (error) => {
                        reject(error);
                    });
            });
        });
    }

    /**
     * Returns a query builder for this model.
     */
    static q() {
        let sq = new SimpleQuery();
        sq.setModel(this);
        return sq;
    };

    static async get(query) {
        let db = SQLite.openDatabase(this.databaseName() + '.sqlite');

        return new Promise((resolve, reject) => {
            db.transaction(async (tx) => {
                tx.executeSql(
                    query, [], (tx, res) => {
                        let results = [];
                        if (res.rows._array.length) {
                            res.rows._array.forEach(data => {
                                results.push(new this.prototype.constructor(data));
                            });
                        }
                        resolve(results);
                    }, (error) => {
                        reject(error);
                    });

            });
        });
    };
}
