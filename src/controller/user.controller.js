const {connectionPromise} = require('../../database')

// EndPoints:

// To add a user: 

async function register(req, res) {
    const connection = await connectionPromise;
    try{
        const {username, email, photo, password} = req.body;
        console.log(req.body)

    // Have to verify if the user already exists: 
        const existingUser = await connection.query('SELECT user_id FROM mybookshelf.user WHERE email=?', [email])
        if(existingUser[0].length>0){
            return res.status(400).send({error: true, code:400, message: 'This email is already registered. Please log in'})
        }

    // Add the new user
        const addNewUser = await connection.query('INSERT INTO mybookshelf.user (username, email, photo, password) VALUES (?, ?, ?, ?)', [username, email, photo, password])
        return res.status(200).send({error: false, message: `New user successfully added`})
    }
    catch(error){
        console.log(error)
    }
}

// To log in: 
    
async function login(req,res){
    const connection = await connectionPromise;
    try{
        const {username, password} = req.body
        
        // Verify that email and password
        const query = ('SELECT * FROM user WHERE username = ? AND password = ?', [username, password]);
        return res.send({message: 'User verified'})
    }
    catch(error){
        console.log('Could not verify that user name')
    }
}

module.exports =  {register, login}