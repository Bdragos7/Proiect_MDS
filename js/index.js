const express= require("express");
const session=require('express-session');
const ejs = require("ejs");
const path= require('path');

obGlobal={
    erori:null,
    imagini:[]
 
}

// var client = new Client({database:"proiectmds",
//     user:"dragos",
//     password:"dragos",
//     host:"localhost",
//     port:5432});
// client.connect();

app=express();

app.use(session({ // aici se creeaza proprietatea session a requestului (pot folosi req.session)
    secret: 'abcdefg',//folosit de express session pentru criptarea id-ului de sesiune
    resave: true,
    saveUninitialized: false
  }));

  app.use("/*",function(req,res,next){
    // res.locals.Drepturi=Drepturi;
    if (req.session.utilizator){
        req.utilizator=res.locals.utilizator=new Utilizator(req.session.utilizator);
    }    

    next();
});

app.set("view engine","ejs");  

app.use("/resurse", express.static(__dirname+"/resurse"));

app.get(["/","/index",], function(req, res){
    //console.log("ceva");
   
    res.render("pagini/index", {ip: req.ip, imagini: obGlobal.imagini});
})

app.get(["/employees"],function(req, res){

    res.render("pagini/employees", {ip: req.ip, imagini: obGlobal.imagini});

})


app.get("/*", function(req, res){
    console.log("url:",req.url);
    res.render("pagini"+req.url, function(err, rezRandare){
        
        if(err){
            if(err.message.includes("Failed to lookup view")){
                console.log("nu mere bre!");
                
            }
            
            else{
                
            }
        }
        else{
            res.send(rezRandare);
        }
    });
})


app.get("/employees",function(req, res){
    client.query("select * from employees", function(err, rezCateg){
        continuareQuery=""
        if (req.query.tip)
            continuareQuery+=` and jobtitle='${req.query.tip}'`; //"tip='"+req.query.tip+"'"

        console.log("saal")
        console.log(rezCateg.rows)

        var options = [];
        for (let data of rezCateg.rows) {
            options.push(data.jobtitle)
        }

        console.log(options)
        client.query("select * from employees where 1=1 " + continuareQuery , function( err, rez){
            if(err){
                console.log(err);
                renderError(res, 2);
            }
            else
                res.render("pagini/employees", {produse:rez.rows, optiuni: options});
        });
    });
    console.log(100)
});


app.listen(8080)
console.log("srv a pronit")