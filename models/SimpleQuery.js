class SimpleQuery {
    /**
     * Set up the object and sets the table name.
     * 
     * @param {string} table 
     */
    constructor(table = null) {
        this._table = table;
        this._columns = ['*'];
        this._where = [];
        this._orderBy = []; // [column_name, asc|desc]
        this._limit = null;
        this._model = null;
        return this;
    }

    /**
     * The table name for the queries.
     * 
     * @param {string} table 
     */
    table(table) {
        this._table = table;
    }

    /**
     * Sets the model for the SimpleQuery builder.
     * 
     * @param {object} model 
     */
    setModel(model) {
        this._model = model;
        this._table = model.tableName();
    }

    /**
     * The columns that should be returned in the query.
     * 
     * @param {array} columns 
     */
    select(columns = ['*']) {
        this._columns = columns;
        return this;
    }

    /**
     * The column to fetch distinct values from.
     * 
     * @param {String} column
     */
    distinct(column) {
        this._columns = ['DISTINCT(' + column + ')'];
        return this;
    }

    /**
     * The name of the table to be queried.
     * This method permits querying twin tables with the same object.
     * 
     * @param {string} table 
     */
    from(table = this._table) {
        this._table = table;
        return this;
    }

    /**
     * Changes the where field.
     * 
     * @param {string} field The field name.
     * @param {string} x The condition or the value (2 or 3 params). Defaults to '='.
     * @param {string} y The value to be matched.
     * @param {string} mode The mode AND|OR.
     */
    where(field, x, y = null, mode = 'AND') {
        let where;
        
        // Assume the operation is '=' and the value is the second parameter.
        if (y === null) {
            where = [field, '=', x, mode];
        } else {
            where = [field, x, y, mode];
        }

        this._where.push(where);
        return this;
    }

    /**
     * Tells how to order the columns.
     * 
     * @param {string} column The column name.
     * @param {string} how THe order type ASC|DESC.
     */
    orderBy(column, how = 'ASC') {
        this._orderBy.push([column, how]);
        return this;
    }

    /**
     * The max number of entries to be returned.
     * 
     * @param {number} limit 
     */
    limit(limit) {
        this._limit = limit;
        return this;
    }
    
    /**
     * Builds the query and returns a string to be executed.
     * 
     * @returns {string|array} The built query.
     */
    getQuery() {
        // Start with the select keyword.
        let query = 'SELECT ';
        
        // Specify the columns.
        query += this._columns.join(', ');

        // Specify the table name.
        query += ' FROM ' + this._table;

        // Where clauses.
        for(let i = 0; i < this._where.length; i++) {
            let clause = this._where[i];
            let operator = clause.pop(); // AND|OR|NOT
            operator = i === 0 ? ' WHERE ' : ' ' + operator + ' ';
            query += operator + clause.join(' ');
        }

        // Order clauses.
        for (let i = 0; i < this._orderBy.length; i++) {
            let clause = this._orderBy[i];
            query += i === 0 ? ' ORDER BY ' + clause.join(' ') : ', ' + clause.join(' ');
        }

        // Limit clause.
        if (this._limit && typeof this._limit === 'number' && this._limit > 0) {
            query += ' LIMIT ' + this._limit;
        }

        // Return query string.
        return query;
    }

    /**
     * Runs the query and returns the model instance.
     */
    get() {
        let query = this.getQuery();
        return this._model.get(query);
    }

    /**
     * Runs the query and returns an array of raw results.
     */
    getArray() {
        let query = this.getQuery();
        return this._model.getArray(query);
    }
}

export default SimpleQuery;
