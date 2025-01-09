const {connectionPromise} = require('../../database')

// Jsonwebtoken para que genere un token de autenticación al hacer register y devuleva la respuesta en register

// EndPoints:

const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'your_secret_key';

// To add a user and log them in: 

async function register(req, res) {
    const connection = await connectionPromise;
    try{
        const {username, email, photo, password} = req.body;
        console.log(req.body)

    // Have to verify if the user already exists: 
        const [existingUser] = await connection.query('SELECT user_id FROM mybookshelf.user WHERE email=?', [email])
        if(existingUser.length>0){
            return res.status(400).send({error: true, code:400, message: 'This email is already registered. Please log in'})
        }

    // Add the new user
    const [result] = await connection.query('INSERT INTO mybookshelf.user (username, email, photo, password) VALUES (?, ?, ?, ?)', [username, email, photo, password]);
    console.log("User inserted: ", result)

    // Obtener el ID del nuevo usuario insertado
    const newUserId = result.insertId;
    console.log("new userId: ",  newUserId)

    // Obtain the new user that we have just registered:
    const [newUserRows] = await connection.query('SELECT * FROM mybookshelf.user WHERE user_id = ?', [newUserId])
    const newUser = newUserRows[0];

    // Generate token:
    const token = jwt.sign({ id: newUser.user_id, email: newUser.email }, secretKey, { expiresIn: '1h' });

    // Return with user and token
        return res.status(200).send({
            error: false, 
            message: `New user successfully added and logged in`,
            user: newUser,
            token}) 
    }catch(error){
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
        return res.status(200).send({
            error: false,
            message: `New user successfully added and logged in`,
            token,
            user
        });
    }
    catch(error){
        console.error('Error during login process:', error);
        return res.status(500).send({ message: "Internal server error" });
    }
}

// Edit profile:

async function editProfile(req, res){
    const connection = await connectionPromise;
    
    try{
    // First we need to get the user:
    const user_id = req.params.id
    console.log("User ID received", user_id)

    if(!user_id){
        return res.status(400).send({
            error: true,
            code: 400,
            message: "User ID is not defined"
        })
    }
    const {username, password, photo } = req.body;

    // Get user from Database:
    const [rows] = await connection.query('SELECT * FROM user WHERE user_id = ?', [user_id])
    const currentUser = rows[0]

    if(!currentUser){
        return res.status(404).send({
            error: true,
            code: 404,
            message: "User not found"
        })
    }

    // Modify the data: if undefined it will use the previous data. If not, the edited one:
    const editedUsername = username !== undefined ? username : currentUser.username;
    const editedPassword = password !== undefined ? password : currentUser.password;
    const editedPhoto = photo !== undefined ? photo : currentUser.photo; 

    // Add new data to User table in database:

    const [result] = await connection.query('UPDATE mybookshelf.user SET username = ?, password = ?, photo = ? WHERE user_id = ?', [editedUsername, editedPassword, editedPhoto, user_id])
    console.log("Rows affected:", result.affectedRows);

    if(result.affectedRows === 0){
        return res.status(400).send({
            error: true,
            code: 400,
            message: "No changes made"
        })
    }

    const [updatedRows] = await connection.query('SELECT * FROM user WHERE user_id = ?', [user_id])
    const updatedUser = updatedRows[0]
    console.log("Updated user:", updatedUser);

    return res.status(200).send({
        error: false, 
        code: 200, 
        message: "User updated successfully"
    })
    }catch(error){
        console.log(error)}
}

module.exports =  {register, login, editProfile}