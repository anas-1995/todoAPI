const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('es6-promisify');
// const { createPicturePath, createPictureURL } = require('../../utils/pictureURL');
// const deleteFile = require('../../utils/deleteFile');
// const { sendVerificationEmail, sendResetPasswordEmail } = require('../../utils/sendEmail');
// const sendSMS = require('../../twilio');
const Client = require('../client/clientModel')

jwt.sign = promisify(jwt.sign);
const promisifyRandomBytes = promisify(crypto.randomBytes);

// const picturesDestination = 'clients';

const destructTodo = todo => ({
    id: todo.id,
    content: todo.content,
    status: todo.status,
    creationDate: todo.creationDate,
    lastModifiedDate: todo.lastModifiedDate,
});

const destructClient = client => ({
    client: {
        id: client.id,
        method: client.method,
        [client.method]: {
            id: client[client.method].id,
            email: client[client.method].email,
        },
        todo: client.todo.length == 0 ? [] : client.todo.map(destructTodo),
        verified: client.verified,
        username: client.username,
        media: client.media,
        creationDate: client.creationDate,
        lastModifiedDate: client.lastModifiedDate,
        phone: client.phone,
    },
});

const generateToken = client => {
    const payload = {
        id: client.id,
        type: 'client',
        verified: client.verified,
    };
    return jwt
        .sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' })
        .then(token => ({
            token: `Bearer ${token}`,
        }))
        .catch(err => Promise.reject(err));
};


const generateVerificationToken = () =>
    promisifyRandomBytes(20)
    .then(buffer => buffer.toString('hex'))
    .then(token => ({
        verificationToken: token,
        verificationTokenExpires: Date.now() + 86400000,
    }))
    .catch(err => Promise.reject(err));


const findClientById = Client => id =>
    Client.findOne({ _id: id })
    .then(client => {
        if (!client) {
            return { error: 'Client not found' };
        }
        return destructClient(client);
    })
    .catch(err => Promise.reject(err));




const addTodoToClient = Client => (id, data) =>
    Client.findOne({ _id: id })
    .then(client => {
        if (!client) {
            return { error: 'Client not found' };
        }
        client['todo'].push(data);
        console.log(client);
        return client.save().then(savedClient => {
            return destructClient(savedClient)
        });
    })
    .catch(err => Promise.reject(err));


const updateTodoToClient = Client => (id, todoId, data) =>
    Client.findOne({ _id: id })
    .then(client => {
        if (!client) {
            return { error: 'Client not found' };
        }

        let todoIndex = client['todo'].findIndex(element => element._id == todoId);
        console.log(todoIndex)
        if (!client['todo'][todoIndex]) {
            return { error: 'Todo not found' };
        }
        let creationDate = client['todo'][todoIndex]['creationDate']
        console.log(client['todo'][todoIndex])
        client['todo'][todoIndex] = { "content": data.content, "status": data.status, "lastModifiedDate": new Date(), "creationDate": creationDate };
        return client.save().then(savedClient => {
            return destructClient(savedClient)
        });
    })
    .catch(err => Promise.reject(err));



const getTodoToClient = Client => (id, todoId) =>
    Client.findOne({ _id: id })
    .then(client => {
        if (!client) {
            return { error: 'Client not found' };
        }

        let todoIndex = client['todo'].findIndex(element => element._id == todoId);
        console.log(todoIndex)
        if (!client['todo'][todoIndex]) {
            return { error: 'Todo not found' };
        }
        return destructTodo(client['todo'][todoIndex])
    })
    .catch(err => Promise.reject(err));


const getAllTodoToClient = Client => (id) => {
    return new Promise(async function(resolve, reject) {
        try {
            let client = await Client.findOne({ _id: id })
            if (!client) {
                resolve({ error: 'Client not found' });
            }
            resolve(client['todo'].map(destructTodo))

        } catch (err) {
            Promise.reject(err)
        }
    })
}




const deleteTodoToClient = Client => (id, todoId) =>
    Client.findOne({ _id: id })
    .then(client => {
        if (!client) {
            return { error: 'Client not found' };
        }

        let todoIndex = client['todo'].findIndex(element => element._id == todoId);
        console.log(todoIndex)
        if (!client['todo'][todoIndex]) {
            return { error: 'Todo not found' };
        }
        client['todo'].splice(todoIndex, 1)
        return client.save().then(savedClient => {
            return destructClient(savedClient)
        });
    })
    .catch(err => Promise.reject(err));





const signUp = Client => data =>
    Client.findOne({ 'localAuth.email': data.email })
    .then(client => {
        if (client) {
            return { error: 'Email already exists, you can reset your password' };
        }
        return generateVerificationToken().then(verificationData => {
            const newClient = new Client({
                media: data.media,
                method: 'localAuth',
                localAuth: {
                    email: data.email,
                    password: data.password,
                },
                verificationToken: verificationData.verificationToken,
                verificationTokenExpires: verificationData.verificationTokenExpires,
                username: data.username,
            });
            return newClient.save().then(savedClient => {
                const context = {
                    fullName: savedClient.username,
                    url: `${process.env.SERVER_URL}/api/client/auth/signup/verify?token=${savedClient.verificationToken}`,
                };
                // sendVerificationEmail(savedClient.localAuth.email, context);
                return generateToken(savedClient);
            });
        });
    })
    .catch(err => Promise.reject(err));

const login = Client => data =>
    Client.findOne({ 'localAuth.email': data.email })
    .then(client => {
        if (!client) {
            return { error: 'Client not found' };
        }
        return client.comparePassword(data.password).then(isMatch => {
            if (!isMatch) {
                return { error: 'Incorrect password' };
            }
            // checking for phone verification
            return generateToken(client);
        });
    })
    .catch(err => Promise.reject(err));


const changePassword = Client => (id, data) =>
    Client.findOne({ _id: id })
    .then(client => {
        if (!client) {
            return { error: 'Client not found' };
        }
        console.log(client.method);
        if (client.method !== 'localAuth') {
            return { error: 'Client is not using Email/Password strategy' };
        }
        return client.comparePassword(data.oldPassword).then(isMatch => {
            if (!isMatch) {
                return { error: 'Incorrect old password.' };
            }
            return Client.findByIdAndUpdate(id, { $set: { 'localAuth.password': data.newPassword } }, { new: true }).then(
                () => ({
                    updated: true,
                })
            );
        });
    })
    .catch(err => Promise.reject(err));


const editProfile = Client => (id, data, avatar) =>
    Client.findOne({ _id: id }).populate('media')
    .then(client => {
        if (!client) {
            return { error: 'Client not found' };
        }
        console.log(client)
        client['username'] = data.username;
        client['media'] = data.media;
        return client.save().then(savedClient => {
            return destructClient(savedClient);
        });

    })
    .catch(err => {
        if (avatar) {
            deleteFile(avatar);
        }
        return Promise.reject(err);
    });




module.exports = Client => ({
    generateToken,
    findClientById: findClientById(Client),
    signUp: signUp(Client),
    login: login(Client),
    addTodoToClient: addTodoToClient(Client),
    updateTodoToClient: updateTodoToClient(Client),
    deleteTodoToClient: deleteTodoToClient(Client),
    getTodoToClient: getTodoToClient(Client),
    changePassword: changePassword(Client),
    editProfile: editProfile(Client),
    getAllTodoToClient: getAllTodoToClient(Client)
});