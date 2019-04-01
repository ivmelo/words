import SimpleModel from './SimpleModel';

const defaults = {
    entry: '',
    date: new Date()
}

class Entry extends SimpleModel {
    static databaseName() {
        return 'words';
    }

    static tableName() {
        return 'entries';
    }

    static dateFields() {
        return [
            'created_at', 
            'updated_at',
            'date'
        ];
    }

    constructor(data = {
        entry: defaults.entry,
        date: defaults.date,
    }) {
        super(data); // Sets id and date fields inside parent object.
        this.entry = data.entry || defaults.entry;
        this.date = data.date || defaults.date;
    }
}

export default Entry;
