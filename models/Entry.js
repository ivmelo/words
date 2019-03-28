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
        return 'items';
    }

    static dateFields() {
        return [
            'created_at', 
            'updated_at',
            'date'
        ];
    }

    constructor(
        data = {
            id: null,
            entry: defaults.entry,
            date: defaults.date,
            created_at: new Date(),
            updated_at: new Date(),
        }
    ) 
    {
        super();
    
        this.id = data.id;
        this.entry = data.entry || defaults.entry;
        this.date = data.date || defaults.date;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }
}

export default Entry;