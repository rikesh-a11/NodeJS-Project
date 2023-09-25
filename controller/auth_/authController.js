const { users } = require("../../model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

exports.renderRegisterForm = (req,res)=>{
    res.render("register")
}

exports.registerUser = async(req,res)=>{
    const {email,username,password,confirmPassword} = req.body

    //check password with confrim password
    if(password !== confirmPassword){
        return res.send("password and confirmPassword doesn't matched")
    }

    //insert into table (users)
    await users.create({
        username,
        email,
        password: bcrypt.hashSync(password,8)
        
    })
    res.redirect("/login")

}

//login starts

exports.renderLoginForm = (req,res)=>{
    res.render("login")
}

exports.loginUser = async(req,res)=>{
    const {email,password} = req.body

    //server side validation
    if(!email || !password){
        return res.send("email and password required")
    }

    //check is email exists or not
    const associatedDataWithEmail = await users.findAll({
        where : {
            email:email
        }
    })
    if(associatedDataWithEmail.length == 0){
        res.send("User Email doesn't exists")
    }else{
        const associatedEmailPassword = associatedDataWithEmail[0].password
        const isMatched = bcrypt.compareSync(password,associatedEmailPassword)  //trye or false return

        if(isMatched){

            //generate token here
            const token = jwt.sign({id:associatedDataWithEmail[0].id},process.env.SECRETKEY,{
                expiresIn: '30d'
            })
            res.cookie('token',token)  //browser ma application  tab vitra cookie vanney ma save hunxa


            res.send("login Sucess")
        }else{
        res.send("Invalid password")
        }
    }


}
