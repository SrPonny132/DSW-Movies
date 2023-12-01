const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users.model');

exports.registerUser = async (req, res) => {
try{
    const{userName,email,password,}=req.body;
    const existingUser =await User.findOne({email});
    if(existingUser){
        return res.status(400).json({message:"El usuario ya existe"});
    } 
    const hashedPassword = await bcrypt.hash(password,10);

    const newUser = new User({userName,email,password:hashedPassword});
    await newUser.save();
    return res.status(201).json({message:"Usuario creado con exito"});
    }catch (error){
        res.status(500).json({message:"Algo salio mal"});
    }
};

exports.getUser = async (req, res) => {
    try{
        const users=await User.find();
        return res.status(200).json({
            message:"Usuarios obtenidos correctamente",
            data:users
        });
    }catch (error){
        res.status(500).json({message:"Algo salio mal",
        data:users
    
    });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "El usuario no existe" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(400).json({ message: "Credenciales invalidas" });
        }

        const token = jwt.sign({ userId: user._id, Username: user.userName }, 'secreto', { expiresIn: "8h" });
        const formattedUser = {
            _id: user._id,
            userName: user.userName,
            userEmail: user.email,
        };

        return res.json({ action: 'login', token, user: formattedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ action: "login", message: "Error al iniciar sesion" });
    }
};
