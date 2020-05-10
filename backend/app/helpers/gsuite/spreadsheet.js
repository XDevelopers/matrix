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
    room.style = row[2] = row[2] ? row[2] : '';
    room.blink = row[3] ? row[3].toLowerCase() === 'true' : false;
    room.disableMeeting = row[4] ? row[4].toLowerCase() === 'true' : false;
    room.externalMeetUrl = row[5] ? row[5] : '';
    room.top = row[6] ? row[6].toLowerCase() === 'true' : false;
    return room;
}

const listRooms = (spreadsheetId) => {
    return getAuth().then(auth => {
        const sheets = google.sheets({ version: 'v4', auth });
        return new Promise((resolve, reject) => {
            sheets.spreadsheets.values.get({
                spreadsheetId: spreadsheetId,
                range: 'rooms!A2:G',
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