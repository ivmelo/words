import {AsyncStorage} from 'react-native';

class Entry {
    static entries = [];

    text;
    date;
    created_at;

    constructor(text, date) {
        this.text = text;
        this.date = date;
        this.created_at = new Date().getTime();
    }

    static _saveAll() {
        return AsyncStorage.setItem('entries', JSON.stringify(Entry.entries))
            .then(data => data)
            .catch(error => error);
    }

    _save() {
        this.created_at = new Date().getTime();

        // Entry.entries = [];

        // console.log(Entry.entries);

        if (Entry.entries.length == 0) {
            Entry._all().then(entries => {
                // 
                // Entry.entries = entries;
                Entry.entries.push(this);
                return Entry._saveAll(Entry.entries);
            });
        }

        Entry.entries.push(this);
        return Entry._saveAll(Entry.entries);
    }

    static _clear() {
        return AsyncStorage.removeItem('entries')
            .then(data => data)
            .catch(err => err);
    }

    static _all() {
        return AsyncStorage.getItem('entries').then((entries) => {
            if (entries != null && entries.length) {
                Entry.entries = entries;
                return JSON.parse(entries);
            }
            return [];
        }).catch(error => {
            return error;
        });
    }
}

export default Entry;
