const { google } = require("googleapis");

const getAuth2 = (cb) => {
    return google.auth.getApplicationDefault({
        subject: process.env.GSUITE_ADMIN_IMPERSONATE
    }, function (err, authClient, projectId) {
        if (err) {
            console.log('err', err);
            return;
        }
        // console.log('xxxxxxxx here')
        // && authClient.createScopedRequired()
        authClient = authClient.createScoped([
            'https://www.googleapis.com/auth/admin.reports.audit.readonly'
        ]);
        // console.log('auth', authClient);
        // console.log('project', projectId);
        cb(authClient, projectId)
    });

}

function xpto(auth) {
    const service = google.admin({ version: 'reports_v1', auth });
    service.activities.list({
        userKey: 'all',
        applicationName: 'meet',
        eventName: 'call_ended',
        maxResults: 20,
    }, (err, res) => {
        if (err) return console.error('The API returned an error:', err.message);

        const activities = res.data.items;
        if (activities.length) {
            console.log('Logins:');
            activities.forEach((activity) => {
                console.log(activity)
                // console.log(`${activity.id.time}: ${activity.actor.email} (${activity.events[0].name})`);
            });
        } else {
            console.log('No logins found.');
        }
    });
}

const listEvents = (spreadsheetId) => {
    return getAuth2(xpto);
}


module.exports = {
    listEvents: listEvents
};