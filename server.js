const express = require('express');
const cors = require('cors')
const app = express();
const db = require("./app/db")
const multer = require("multer")
const PORT = process.env.PORT || 3100

app.use(cors())

// app.use(bodyParser.json());s
app.use(express.json())
// const publicPath = path.join(__dirname,'./public')
// app.use(express.static(publicPath))


// parse requests of content-type: application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }));

 app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-With Content-Type Accept");
    res.setHeader("Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    next();    
 });

// const imagesFolderPath = path.join(__dirname, 'uploads');
// app.use('/uploads',express.static(imagesFolderPath));

// require('./routes/zupeeHome.routes.js')(app)
// require('./routes/Api.js')(app)

   const storage = multer.diskStorage({
        destination: (req,file,cb)=>{
            cb(null, 'uploads/');
        },
        filename: (req,file,cb) =>{
            // const timeStamp = Date.now().toString();
            // const timestamp = Date.now().toString() + path.extname(file.originalname).toLowerCase()
            // cb(null, timestamp);
            const timestamp = Date.now().toString();
            const randomString = crypto.randomBytes(8).toString('hex'); // Generates an 8-byte random hex string
            const uniqueFilename = `${timestamp}_${randomString}${path.extname(file.originalname).toLowerCase()}`;
            cb(null, uniqueFilename);
        }
    });

    const upload = multer({storage: storage});


app.get("/getData",(req,res)=>{
    q = "select * from spinner_data"
    db.query(q,(err,result)=>{
        if (err) throw err;
        res.json(result)
    })
})

app.get("/getSingleData/:id",(req,res)=>{
    q = "select * from spinner_data where id = ?"
    // console.log(req.params.id)
    db.query(q,[req.params.id],(err,result)=>{
        if(err) throw err;
        res.json(result[0])
    })
})

app.post("/addPrice",upload.none(),(req,res)=>{
    let generatedId = req.body.generatedId
    let price = parseInt(req.body.price)
    id = req.body.id 
    // console.log(id)
    // console.log(generatedId)
    let columnName;
    // console.log(id)
    // console.log(price)
    if (id === '1') {
        columnName = 'tiger';
    } else if (id === '2') {
        columnName = 'lion';
    } else if (id === '3') {
        columnName = 'dragon';
    } else if (id === '4') {
        columnName = 'king';
    }else{
        
    } 

    // console.log(columnName)
    if (columnName) {
        const q = `INSERT INTO bets(${columnName},generatedId) VALUES (?,?)`;

        db.query(q, [price,generatedId], (err, result, fields) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Internal server error" });
            }
    
            return res.json({ message: "Data added successfully",generatedId});
        });
    } else {
        return res.status(400).json({ error: "Invalid ID provided" });
    }
    
})

app.get("/showBetsData/:id",(req,res)=>{
    id = req.params.id
console.log(id)
    //this query for not counting 0 its counted from 1 minimum value
    // const q =  `SELECT field, COUNT(*) AS count
    // FROM (
    //     SELECT 'tiger' AS field, tiger AS count FROM bets WHERE tiger > 0 
    //     UNION 
    //     SELECT 'lion' AS field, lion AS count FROM bets WHERE lion > 0 
    //     UNION 
    //     SELECT 'dragon' AS field, dragon AS count FROM bets WHERE dragon > 0 
    //     UNION 
    //     SELECT 'king' AS field, king AS count FROM bets WHERE king > 0 
    // ) AS subquery
    // GROUP BY field
    // ORDER BY count ASC
    // LIMIT 1;`;
    
    //this query to find minimum value as 0 which has
    const q =  `SELECT 'tiger' AS field, COUNT(tiger) AS count FROM bets WHERE generatedId = ? AND tiger >=0
    UNION 
    SELECT 'lion' AS field, COUNT(lion) AS count FROM bets WHERE generatedId = ? AND lion>=0
    UNION 
    SELECT 'dragon' AS field, COUNT(dragon) AS count FROM bets WHERE generatedId = ? AND dragon>=0
    UNION 
    SELECT 'king' AS field, COUNT(king) AS count FROM bets WHERE generatedId = ? AND king>=0
    ORDER BY count ASC LIMIT 1;
    
    `;   
    // if(tiger === 0 && lion === 0 && dragon === 0 && king === 0){

    //         const a = Math.floor(Math.random() * 4)
    //         console .log(a)
    // } 

    db.query(q,[id,id,id,id],(err,rows)=>{
       if (err) throw err;
        if (rows.length === 0 || rows[0].count === 0 && rows[0].field === 'tiger') {
            // If there are no bets in any field, generate a random field and send it as the response
            const fields = ['tiger', 'lion', 'dragon', 'king'];
            const randomField = fields[Math.floor(Math.random() * fields.length)];
            res.send({ field: randomField, count: 0 });
        } else {
            // If there are bets in at least one field, send the response
            res.send(rows[0]);
            console.log(rows[0])
        }
    })
})
// app.delete("/deletePrice",(req,res)=>{
//     q= "delete from bets"
//     db.query(q,(err,row)=>{
//         if (err) throw err;
//         res.send({message:"deleted old prices"})
//     })
// })

app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`)
})