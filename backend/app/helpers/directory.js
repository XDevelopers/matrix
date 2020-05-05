const { google } = require("googleapis");

const getAuth = () => {
    return google.auth.getClient({
        scopes: [
            "https://www.googleapis.com/auth/admin.directory.user.readonly"
        ]
    });
}

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
            'https://www.googleapis.com/auth/admin.directory.user.readonly'
        ]);
        // console.log('auth', authClient);
        // console.log('project', projectId);
        cb(authClient, projectId)
    });

}

const listUsers = (auth) => {
    const service = google.admin({ version: 'directory_v1', auth });
    service.users.list({
        customer: 'my_customer',
        domain: 'dextra-sw.com',
        maxResults: 10,
        viewType: 'domain_public',
        orderBy: 'email',
    }, (err, res) => {
        if (err) return console.error('The API returned an error:', err);

        const users = res.data.users;
        if (users.length) {
            console.log('Users:');
            users.forEach((user) => {
                console.log(`${user.primaryEmail} (${user.name.fullName})`);
            });
        } else {
            console.log('No users found.');
        }
    });
}

const xpto = (auth) => {
    const service = google.admin({ version: 'directory_v1', auth: auth });
    service.users.get({
        userKey: 'fernando@dextra-sw.com',
        domain: 'dextra-sw.com'
    }, (err, res) => {
        if (err) return console.error('The API returned an error:', err);
        console.log('res', res);
    });
}


const userInfo = (spreadsheetId) => {
    return getAuth2(xpto);
}


module.exports = {
    userInfo: userInfo
};