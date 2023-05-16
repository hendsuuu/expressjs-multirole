import Users from "../models/UserModels.js"
import argon2 from "argon2";


export const Login = async (req, res) => {
    try {
        const user = await  Users.findOne({
            where:{
                email: req.body.email
            }
        });
        if(!user) return res.status(404).json({msg: "User Tidak Ditemukan "});
        const match = await argon2.verify(user.password, req.body.password);
        if(!match) return res.status(400).json({msg:"Password Tidak cocok"});
        req.session.userId = user.uuid;
        const uuid = user.uuid;
        const name = user.name;
        const email = user.email;
        const role = user.role;
        res.status(200).json({uuid, name, email, role})
    } catch (error) {
        console.log(error.message);
    }
}

export const Me = async (req, res) => {
    if(!req.session.userId){
        return res.status(401).json({msg: "Silahkan Login Terlebih Dahulu"})
    }
    const user = await Users.findOne({
        attributes: ['uuid','name','email','role'],
        where: {
            uuid: req.session.userId
        }
    })
    if(!user) return res.status(404).json({msg: "User Tidak Ditemukan"});
    res.status(200).json(user)
}

export const Logout = (req, res) =>{
    req.session.destroy((err)=>{
        if(err) return res.status(400).json({msg: "Tidak dapat logout"});
        res.status(200).json({msg: "Anda Telah Logout"});
    })
}