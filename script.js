let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let session = require('express-session');
let cookieParser = require('cookie-parser');

//Data Files
let fs = require('fs');
let stdData = require('./student.json');
let login = require('./loginData.json');

//Login Status
let loginStatus = false;

//Server Listening Port
let port = 9000;

//View Engine
app.set('view engine', 'ejs');

//Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({secret : "This is secret data don't expose it ti anyone"}))


//thind conroller / handlers

app.get('/login' , (req , res)=>{
    let model = {}
    if('message' in req.session)
        {
            model.message = req.session.message;
        }
        model.session_id = "asdadafs"
    res.render('login')
})
app.post('/login' , (req ,res)=>{

    login.forEach(userLogin=>{
        if(req.body.username === userLogin.username && req.body.password === userLogin.password){
            req.session.userLogin = true
            res.redirect('./dashboard')
        }
        
    })
    res.redirect('/login')
    
})
app.get('/createaccount' , (req , res)=>{
    res.render('signup')
})
app.post('/createaccount' , (req , res)=>{
    let userData = req.body;
     console.log(userData);
     login.push(userData);

     fs.writeFile("./loginData.json" , JSON.stringify(login) , err =>{
        if(err)
            console.log(err)

       console.log("new user regitered");
    })
    res.redirect('/login');
})

app.get('/dashboard', (req, res) => {

    fs.readFile('student.json', 'utf-8', function (err, data) {
        if (err) { console.log(err) }
        else {
            //console.log(data)
        }

        let stdData = JSON.parse(data)
    })

    res.render("index", { std: stdData })
});

app.get('/form', (req, res) => {
    res.render('form.ejs')
})

app.post('/form', (req, res) => {
    let std = req.body;

    stdData.push(std);

    fs.writeFile(
        "student.json",
        JSON.stringify(stdData),
        err => {
            // Checking for errors 
            if (err) throw err;

            // Success 
            console.log("Done writing");
        })
    console.log(std)
    res.redirect('/dashboard')
});

app.get('/updateForm' , (req ,res)=>{
    let id = req.query.id;
    let updatedStd = stdData.find(function(std){return std.id === id})

    res.render('updateForm' , {id:updatedStd.id , name : updatedStd.name , age : updatedStd.age , gender : updatedStd.gender , section : updatedStd.section , city : updatedStd.city , province : updatedStd.province , country : updatedStd.country})
})

app.post('/updateForm' , (req , res)=>{
   console.log(req.body.id)
    stdData.forEach(student =>{
        
        if(student.id === req.body.id)
            {
                student.name = req.body.name
                student.age = req.body.age
                student.section = req.body.section
                student.gender = req.body.gender
                student.city = req.body.city
                student.province = req.body.province
                student.country = req.body.country

                console.log(student)
            }
    })

    fs.writeFile("./student.json", JSON.stringify(stdData), err => {
        if (err) throw err;
        console.log("Operation done")
    });

     res.redirect('/dashboard')
})

app.post('/delete', (req, res) => {

    let stdIndex = stdData.findIndex(function (student) { return req.body.id === student.id })
    console.log(stdIndex)

    if (stdIndex > -1)
        stdData.splice(stdIndex, 1);

    //console.log(stdData)
     fs.writeFileSync('./student.json', JSON.stringify(stdData))


     console.log(stdData);

     res.redirect('/dashboard')
});

//Listening port
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
});