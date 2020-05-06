const { google } = require("googleapis");

const getAuth = () => {
    return google.auth.getClient({
        scopes: [
            "https://www.googleapis.com/auth/calendar.readonly"
        ]
    });
}

const xpto = (auth) => {
    const calendar = google.calendar({ version: 'v3', auth });
    calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const events = res.data.items;
        if (events.length) {
            console.log('Upcoming 10 events:');
            events.map((event, i) => {
                console.log('e', event);
                const start = event.start.dateTime || event.start.date;
                console.log(`${start} - ${event.summary}`);
            });
        } else {
            console.log('No upcoming events found.');
        }
    });
}

const listCals = (spreadsheetId) => {
    return getAuth().then(auth => {
        xpto(auth);
    });
}


module.exports = {
    listCals: listCals
};