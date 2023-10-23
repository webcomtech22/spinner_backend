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
    db.query(q,[req.params.id],(err,result)=>{
        if(err) throw err;
        res.json(result[0])
    })
})

app.post("/addPrice",upload.none(),(req,res)=>{
    const { id, price } = req.body;
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
    }    
    // console.log(columnName)
    if (columnName) {
        const q = `INSERT INTO bets(${columnName}) VALUES (?)`;
    
        db.query(q, [price], (err, result, fields) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Internal server error" });
            }
    
            return res.json({ message: "Data added successfully" });
        });
    } else {
        return res.status(400).json({ error: "Invalid ID provided" });
    }
    
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