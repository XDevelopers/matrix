const { google } = require("googleapis");

const getAuth = () => {
    return google.auth.getClient({
        scopes: [
            "https://www.googleapis.com/auth/calendar.readonly"
        ]
    });
}

const parseMeetUrl = (event) => {
    try {
        const entryPoints = event.conferenceData.entryPoints.filter(e => e.entryPointType === 'video')
        if (entryPoints.length > 0) {
            entryPoints[0].uri
        }
    } catch (err) { }
    // try to parse from description
    if (event.description) {
        const regex = /.*href=\"([^\"]+)\".*/g;
        const match = regex.exec(event.description);
        if (match) {
            return match[1];
        }
    }
    return undefined
}

const parseRoom = (event) => {
    const style = {
        backgroundColor: '#000000',
        backgroundImage: 'url(https://image.freepik.com/free-photo/alarm-clock-yellow-background-3d-rendering_34008-35.jpg)'
    }
    const room = {
        id: event.id,
        name: event.summary,
        start: event.start.dateTime,
        end: event.end.dateTime,
        externalMeetUrl: parseMeetUrl(event),
        style: JSON.stringify(style)
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

const listRooms = (calendarId) => getAuth().then(auth => listRoomsAuth(calendarId, auth));

module.exports = {
    listRooms: listRooms
};