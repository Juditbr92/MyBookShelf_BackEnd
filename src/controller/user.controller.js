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
        const {email, password} = req.body

        // Verify that the email and password exists: 
        if(!email || !password){
            return res.send({message:"Email and password required"})
        }
        
        // Search the user:
        const query = ('SELECT * FROM user WHERE email = ? AND password = ?');
        const [ rows ] = await connection.execute(query, [email, password])
        // When consulting, the function will return an array. The first element is rows, which hast the results of the search. The second element contains additional data

        // Verify if that user was found: if rows = 0 there is no element in the search that coincides with the search itself. 
    
        if(rows.length === 0) {
            return res.status(401).send({message: "Invalid credentials "})
        }
        
        // If rows is not 0, we can return the user: 
        const user = rows[0];
        return res.status(200).send({user})
    }
    catch(error){
        console.log('Could not verify that user name')
    }
}

module.exports =  {register, login}