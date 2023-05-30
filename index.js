const express= require("express");

// const ejs = require("ejs");
// const path= require('path');
const {Client} = require("pg");

obGlobal={
    erori:null,
    imagini:[]
 
}
const session=require('express-session');

var client = new Client({
    database:"proiectmds",
    user:"dragos",
    password:"dragos",
    host:"localhost",
    port:5432});
client.connect();

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

app.get(["/","/index","/home","/login"], function(req, res){
    //console.log("ceva");
   
    res.render("pagini/index", {ip: req.ip, imagini: obGlobal.imagini});
})

// app.get(["/employees"],function(req, res){

//     res.render("pagini/employees", {ip: req.ip, imagini: obGlobal.imagini});

// })

app.get("/products", function(req, res){
    
    client.query("select * from products", function(err,rez){
        //console.log(rez.rows)
        if(err){
            console.log(err)
            renderError(res,2);
        }
        else
            res.render("pagini/products", {products:rez.rows});
    });

    

});

app.get("/reports", function(req, res){
    console.log("ceva");
    client.query("select round(avg(salary),2) from employees  group by departmentid order by departmentid asc", function(err,rez){
       //console.log(rez.rows)
        if(err){
            console.log(err)
            renderError(res,2);
        }
        client.query("select round(avg(age),0) from employees  group by departmentid order by departmentid asc", function(err,rezAge){
            //console.log(rezAge.rows)
             if(err){
                 console.log(err)
                 renderError(res,2);
             }
             client.query("select distinct extract( month from salesdate) as sal from sales order by sal asc ", function(err,rezMon){
                //console.log(rezMon.rows)
                 if(err){
                     console.log(err)
                     renderError(res,2);
                 }
                 client.query("select * from products ", function(err,rezProd){
                   // console.log(rezProd.rows)
                     if(err){
                         console.log(err)
                         renderError(res,2);
                     }
                    client.query("select * from departments", function(err,rezDep){
                        //console.log(rezDep.rows)
                        if(err){
                            console.log(err)
                            renderError(res,2);
                        }
                        client.query("select * from sales ", function(err,rezSales){
                            //console.log(rezSales.rows)
                              if(err){
                                  console.log(err)
                                  renderError(res,2);
                              }

                              client.query("select distinct(jobtitle) from employees ", function(err,rezJob){
                                //console.log(rezJob.rows)
                                  if(err){
                                      console.log(err)
                                      renderError(res,2);
                                  }
                                  client.query("select * from employees order by empid asc ", function(err,rezEmp){
                                    //console.log(rezEmp.rows)
                                      if(err){
                                          console.log(err)
                                          renderError(res,2);
                                      }
                                      client.query("SELECT empid, (endvacation - startvacation) AS numDays FROM vacations order by empid asc; ", function(err,rezDays){
                                        console.log(rezDays.rows)
                                          if(err){
                                              console.log(err)
                                              renderError(res,2);
                                          }
                                            else
                                                res.render("pagini/reports", {employees:rez.rows,ages:rezAge.rows, salesMon:rezMon.rows,
                                                    produse:rezProd.rows, vacDays:rezDays.rows, jobtitle:rezJob.rows, emp2:rezEmp.rows, sales:rezSales.rows, department:rezDep.rows});
});
});
});
});
});
});
});
});
});
});



app.get("/employees", function(req, res){
    console.log("ceva");
    client.query("select * from employees", function(err,rez){
        console.log(rez.rows)
        if(err){
            console.log(err)
            renderError(res,2);
        }
        // else
            // res.render("pagini/employees", {employees:rez.rows});
        client.query("select * from departments", function(err,rezDep){
        
            if(err){
                console.log(err)
                renderError(res,2);
            }
            else
                res.render("pagini/employees", {employees:rez.rows, department:rezDep.rows});
    });

    
    
    });

    

});

// app.get("/*", function(req, res){
//     console.log("url:",req.url);
//     res.render("pagini"+req.url, function(err, rezRandare){
        
//         if(err){
//             if(err.message.includes("Failed to lookup view")){
//                 console.log("nu mere bre!");
                
//             }
            
//             else{
                
//             }
//         }
//         else{
//             res.send(rezRandare);
//         }
//     });
// })





// app.get("/employees",function(req, res){
//     client.query("select * from employees", function(err, rezCateg){
//         continuareQuery=""
//         if (req.query.tip)
//             continuareQuery+=` and jobtitle='${req.query.tip}'`; //"tip='"+req.query.tip+"'"

//         console.log("saal")
//         console.log(rezCateg.rows)

//         var options = [];
//         for (let data of rezCateg.rows) {
//             options.push(data.jobtitle)
//         }

//         console.log(options)
//         client.query("select * from employees where 1=1 " + continuareQuery , function( err, rez){
//             if(err){
//                 console.log(err);
//                 renderError(res, 2);
//             }
//             else
//                 res.render("pagini/employees", {produse:rez.rows, optiuni: options});
//         });
//     });
//     console.log(100)
// });


app.listen(8080)

console.log("srv a pronit")