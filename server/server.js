require('dotenv').config();
const express = require('express')

const cors = require('cors')
const app = express();
const db =require('./db');
app.use(cors());

app.use(express.json()); //req.body

//GET ALL
app.get("/api/v1/restro",async(req,res)=>{

const results = await db.query("SELECT * from restaurants");

try {
   
    res.status(200).json({
        status :"success",
        results: results.rows.length,
        data:{
            restaurants:results.rows,
        }
       })
} catch (error) {
    console.log(error.message);
}

});

//get a restaurant
app.get("/api/v1/restro/:id",async(req,res)=>{
   
    try {
    const restaurant = await db.query("SELECT * FROM restaurants where id=$1",[req.params.id])
    
    const reviews = await db.query("SELECT * FROM reviews where restaurant_id=$1",[req.params.id])
    
    res.status(200).json({
        status:"success",
        data:{
            restaurant:restaurant.rows[0],
            reviews: reviews.rows
        }
    })
    
} catch (error) {
    console.log(error.message);
}
});

//Create a restro

app.post("/api/v1/restro",async(req,res)=>{


   try {
    const results = await db.query("INSERT INTO restaurants(name,location,price_range) values ($1,$2,$3) returning *",[req.body.name,req.body.location,req.body.price_range])
    
    res.status(200).json({
     status:"success",
     data:{
         restaurant:results.rows[0],

     },
 })
   } catch (error) {
    console.log(error);
   }

})

//update restraurants

app.put("/api/v1/restro/:id",async(req,res)=>{
const results = await db.query("UPDATE restaurants SET name=$1, location=$2,price_range=$3 where id=$4 returning *",
[req.body.name,req.body.location,req.body.price_range,req.params.id])

try {
    res.status(200).json({
        status:"success",
        data:{
           restaurant: results.rows[0],
        }
    })
    }
    
 catch (error) {
    console.log(error);
}})

   
//delete 

app.delete("/api/v1/restro/:id",async(req,res)=>{

    try {
        const results = db.query("DELETE FROM restaurants where id=$1",[req.params.id])
        res.status(204).json({
            status:"success"
        })
    } catch (error) {
        console.log(error);
    }
})

app.post("/api/v1/restro/:id/addReview", async(req,res)=>{

    try {
      const newReview= await db.query('INSERT INTO reviews(restaurant_id,name,review,rating)values ($1,$2,$3,$4) returning *;',
        [req.params.id,req.body.review,req.body.rating])
        res.status(201).json({
            status:'success',
            data:{
                review: newReview.rows[0],
            },
        });

    } catch (error) {
        console.log(error);
    }
})

const PORT = process.env.PORT  || 3001
app.listen(5000,()=>{
    console.log('Server is listening on port 5000');
});