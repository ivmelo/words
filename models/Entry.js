import SweetModel from 'react-native-sweet-record';
// import SweetModel from './SweetModel';

const defaults = {
    text: '',
    date: new Date()
}

class Entry extends SweetModel {
    static databaseName() {
        return 'words';
    }

    static tableName() {
        return 'entries';
    }

    static dateFields() {
        return ['_created_at', '_updated_at'];
    }

    constructor(
        data = {
            _id: -1,
            text: defaults.text,
            date: defaults.date,
            _created_at: new Date(),
            _updated_at: new Date(),
        }
    ) 
    {
        super();
    
        this._id = data._id;
        this.text = data.text || defaults.text;
        this.date = data.date || defaults.date;
        this._created_at = data._created_at;
        this._updated_at = data._updated_at;
    }
}

export default Entry;