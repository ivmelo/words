import SimpleMigrations from "./SimpleMigrations";
import Entry from '../models/Entry';

class Migrations extends SimpleMigrations {

    /**
     * First migration method. Creates the entries table.
     */
    static async migrate_to_1() {
        let sql = `
            CREATE TABLE IF NOT EXISTS entries (
                id INTEGER PRIMARY KEY NOT NULL, 
                entry TEXT NOT NULL, 
                date INTEGER NOT NULL, 
                created_at INTEGER NOT NULL, 
                updated_at INTEGER NOT NULL
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
     * Creates an example entry with info about the app.
     */
    static async migrate_to_2() {
        let date = new Date();
        let entry = new Entry(date.getFullYear(), date.getMonth(), date.getDate());
        entry.entry = `😊 Thank you for downloading Words.

We are very happy that you gave us a chance to become your daily writing companion. But before you begin your journey with us, let's just quickly go over some features and tips that will help you make the best possible use of this app.
        
📝 To create an entry just tap the floating add button on the home screen of the app. To edit an entry, just tap it to open, then tap the pen icon on the navigation bar (the one at the top) to enter edit mode.
        
🗓 To change the date of an entry, just tap the calendar icon on the navigation bar when in editing mode and use the calendar to pick a new date. You can have as many entries as you want on a single day.
        
📆 To switch between months on the app's home screen, just tap the calendar icon on the navigation bar and use the month arrows to navigate. Note that dots will appear underneath the days that you have entries.
        
🗑 To delete an entry you can either press and hold it from the app's home screen or open it and tap the trash can button on the navigation bar.
        
🔐 To keep your entries safe, make sure you create a PIN and activate the fingerprint lock (if your device supports it) from the settings screen. This is very important if other people use your device.
        
💾 Make sure you backup your data regularly so you don't lose your entries in case you lose, break or someone steals your device. You can do it from the settings screen. Please keep your backup in a safe place such as a cloud storage service or external drive.
        
📨 That's all for now. If you have any questions or need help, please send an email to hello.words@outlook.com and we will be happy to assist you.
        
Happy writing!
        
- I. Melo
Lead Developer of Words
        
PS: Don't forget to delete this entry when you're done here.`;

        try {
            await entry.save();
        } catch (error) {
            return false;
        }

        return true;
    }
}

export default Migrations;
