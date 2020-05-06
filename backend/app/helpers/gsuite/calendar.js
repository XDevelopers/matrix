const { google } = require("googleapis");

const getAuth = () => {
    return google.auth.getClient({
        scopes: [
            "https://www.googleapis.com/auth/calendar.readonly"
        ]
    });
}

const parseRoom = (event) => {
    const entryPoints = event.conferenceData.entryPoints.filter(e => e.entryPointType === 'video')
    const room = {
        id: event.id,
        name: event.summary,
        start: event.start.dateTime,
        end: event.end.dateTime,
        externalMeetUrl: entryPoints.length > 0 ? entryPoints[0].uri : undefined
    };
    return room;
}

const listRoomsAuth = (calendarId, auth) => {
    const calendar = google.calendar({ version: 'v3', auth });
    return calendar.events.list({
        calendarId: calendarId,
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    }).then(result => result.data.items.map(parseRoom));
}

const listRooms = async (calendarId) => {
    const auth = await getAuth();
    return listRoomsAuth(calendarId, auth);
}

module.exports = {
    listRooms: listRooms
};