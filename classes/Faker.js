import '../models/Entry';

// TODO: Properly import this.
// var loremIpsum = require('lorem-ipsum-react-native');

class Faker {
    /**
     * Used to generate fake entries for testing with "lorem ipsum".
     * 
     * @param {Date} start The start date to be populated.
     * @param {Number} days The number of days. 
     * @param {Boolean} ovewrite If current entries should be overwritten.
     */
    async fake(startDate = new Date(), days = 10, wipe = true) {
        if (wipe) {
            await Entry.destroyAll();
        }

        date = startDate;

        for (let i = 0; i < days; i ++) {
            let text = loremIpsum({
                count: Math.floor(Math.random() * Math.floor(8)),
                units: 'paragraphs'
            });

            // Create example entry.
            let entry = new Entry();
            entry.entry = text;
            entry.date = date;
            await entry.save();

            // Increment 1 day.
            date.setTime(date.getTime() + 1 * 86400000);
        }
    }
}

export default Faker;
