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

    getIsoDate() {
        // console.log(typeof this.date);
        
        if(typeof this.date !== 'object') {
            return null;
        }

        let day = this.date.getDate() < 10 ? '0' + String(this.date.getDate()) : this.date.getDate();
        let month = (this.date.getMonth() + 1) < 10 ? '0' + String(this.date.getMonth() + 1) : (this.date.getMonth() + 1);
        let year = this.date.getFullYear();
        let isoDate = year + '-' + month + '-' + day;

        console.log(isoDate);

        return isoDate;
    }
}

export default Entry;
