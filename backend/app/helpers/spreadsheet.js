const { google } = require("googleapis");

const getAuth = () => {
    return google.auth.getClient({
        scopes: [
            "https://www.googleapis.com/auth/spreadsheets",
            "https://www.googleapis.com/auth/devstorage.read_only"
        ]
    });
}

const mapRowToRoom = row => {
    const room = {
        id: row[0],
        name: row[1]
    };
    if (row[2]) {
        room.color = row[2]
    }
    if (row[3]) {
        room.blink = row[3].toLowerCase() === 'true'
    }
    if (row[4]) {
        room.disableMeeting = row[4].toLowerCase() === 'true'
    }
    if (row[5]) {
        room.externalMeetUrl = row[3]
    }
    return room;
}

const listRooms = (spreadsheetId) => {
    return getAuth().then(auth => {
        const sheets = google.sheets({ version: 'v4', auth });
        return new Promise((resolve, reject) => {
            sheets.spreadsheets.values.get({
                spreadsheetId: spreadsheetId,
                range: 'rooms!A2:D',
            }, (err, res) => {
                if (err) {
                    reject('The API returned an error: ' + err);
                    return;
                }
                const rows = res.data.values;
                if (rows.length) {
                    resolve(rows.map(mapRowToRoom));
                } else {
                    resolve([]);
                }
            });
        });
    });
}


module.exports = {
    listRooms: listRooms
};