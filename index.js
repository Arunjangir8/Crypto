const express= require("express");
const axios = require("axios");
const bodyParser= require("body-parser");

const app=express();
const port=3000;
const API_URL = "https://api.coinranking.com/v2/";
const token = "coinranking0085953ac1e1c50c92a91b60b9b529a4a7e8c6a45c5cd08a"

const config = {
    headers: { 'x-access-token': token },
}
app.use(express.static("pubic"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",async(req,res)=>{
    try {
        const response=await axios.get(API_URL+"coins",config)
        const responsestats=await axios.get(API_URL+"stats",config)
        res.render("index.ejs",
            {
                indexCoin : response.data.data.coins.slice(0,51),
                bestCoins: responsestats.data.data.bestCoins,
                indexStats: responsestats.data.data,
            });
        // res.send(responsestats.data.data)
    } catch (error) {
        console.log(error)
    }
})

app.post("/coinDetails",async(req,res)=>{
    const responsestats=await axios.get(API_URL+"stats",config)
    const response=await axios.get(API_URL+"coin/"+req.body.uuid,config)
    var coin=response.data.data.coin;
    var sparklineArray=[];
    var sparkline=coin.sparkline.slice(0,coin.sparkline.length-1);
    sparkline.forEach((item) => {
        sparklineArray.push(item)
    });
    res.render("coinDetails.ejs",{
        indexStats: responsestats.data.data,
        name: coin.name,
        imag: coin.iconUrl,
        price:coin.price,
    })
    
})

// app.get("/coinDetails",async(req,res)=>{
//     const responsestats=await axios.get(API_URL+"stats",config)
//     res.render("coinDetails.ejs",{
//         indexStats: responsestats.data.data
//     })
// })

app.listen(port,()=>{
    console.log(`Runing Server in ${port}`)
})