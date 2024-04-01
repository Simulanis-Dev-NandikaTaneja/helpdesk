const express = require('express'); 
const path = require('path'); 
const app = express(); 
// app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname +'/public', { 
  extensions: ["html", "htm", "gif", "png"],
}))
app.use(express.json());       
app.use(express.urlencoded({extended: true})); 

var engines = require('consolidate');
app.engine('html', engines.mustache);
app.set('view engine', 'html');

//database//
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mydb12345",
  database: "helpdesk"
});

con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT * FROM department", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
});


//

app.get('/home', (req, res) => { 
res.sendFile(path.join(__dirname, '/public/home.html')); 
}); 
app.listen(3000, () => { 
console.log('Server is up on port 3000'); 
});
//

app.post("/login", async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    let querytrack=[]
    console.log(username)
    console.log(password)
    
    var sql = 'SELECT * FROM user,department,query WHERE user.email = ' + mysql.escape(username) + 'and pwd= '+ mysql.escape(password)+ ' and user.d_id=department.d_id and user.user_id=query.user_id';
    con.query(sql, function (err, result) {
    if (err) throw err;
    resultLength = Object.keys(result).length
    console.log(resultLength)
    
    let i = 0;
    while (i < result.length) {
        querytrack.push({queryid:result[i].qid,message:result[i].querytrack});
        i++;
    }
    //querytrack=JSON.stringify(querytrack)
    console.log("query array: ",querytrack);
    if (resultLength>0){
        //res.sendFile(path.join(__dirname, '/public/login.html')); 
        console.log("qid",result[0].qid)
        let p=result[0].pic;
        console.log("hello",typeof querytrack)
        // res.render(path.join(__dirname, '/public/loginnew.html'), {name:result[0].name,pic:result[0].pic,department:result[0].dname,qid:result[0].qid,qname:result[0].queryname});
        res.render(path.join(__dirname, '/public/loginnew.html'), {name:result[0].name,pic:result[0].pic,department:result[0].dname,q:result});
      }
    else{
        res.sendFile(path.join(__dirname, '/public/home.html')); 
    }
    console.log(result);
    });  
    
  })

  //
  app.get('/form', (req, res) => { 
    res.sendFile(path.join(__dirname, '/public/form.html')); 
    }); 


app.post("/query", async (req, res) => {
  const name = req.body.name
  const email = req.body.email
  const phone=req.body.phone
  const query=req.body.query
  const priority=parseInt(req.body.priority)
  console.log(name)
  console.log(email)
  console.log(phone)
  console.log(query)
  console.log(priority)
    var sql = "INSERT INTO query (queryname,email,phone,status,nature,priority,user_id,querytrack) VALUES ?";
    var values = [  
      [name, email, phone, 'active','normal',priority,1,query]
      ];  
    con.query(sql,[values], function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
  res.sendFile(path.join(__dirname, '/public/home.html'));
})