import e from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = e();
const port = 3000;
const API_URL = "https://api.coinranking.com/v2/";
const token = "coinranking0085953ac1e1c50c92a91b60b9b529a4a7e8c6a45c5cd08a"
const config = {
    headers: { 'x-access-token': token },
}
app.use(e.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", async (req,res)=>{
    try {
        const response = await axios.get(API_URL+"coins", config);
        const responseStats = await axios.get(API_URL+"stats", config);
        res.render("index.ejs",
            {
                data: response.data.data.coins.slice(0,51),
                stats: responseStats.data.data,
                bestCoins: responseStats.data.data.bestCoins,
            }
        );        
    } catch (error) {
        console.log(error);
    }
})

app.post("/coinDetails", async (req,res)=>{
    try {
        const response = await axios.get(API_URL+"coin/"+req.body.uuid,config);
        var coin = response.data.data.coin;
        var sparklineArray = []
        var sparkline  = coin.sparkline.slice(0,coin.sparkline.length-1);
        sparkline.forEach((item)=>{
            sparklineArray.push(Number(item));
        })
        res.render("coinDetails.ejs",
            {
                uuid: req.body.uuid,
                name: coin.name,
                price: coin.price,
                description: coin.description,
                change: coin.change,
                allTimeHigh: coin.allTimeHigh.price,
                high: Math.max(...sparklineArray),
                low: Math.min(...sparklineArray),
                sparkline: JSON.stringify(sparklineArray),
                btcPrice: coin.btcPrice,
                rank: coin.rank,
                $24hVolume: coin['24hVolume'],
                marketCap: coin.marketCap,
                fullyDilutedMarketCap: coin.fullyDilutedMarketCap,
                circulating: coin.supply.circulating,
                total: coin.supply.total,
                max: coin.supply.max,
                links: coin.links,
                iconUrl: coin.iconUrl,
                color: coin.color,
                symbol: coin.symbol,
                period: "1h",
            }
        )
    } catch (error) {
        console.log(error.message);
    }
})

app.post("/changePriceChart", async (req,res)=>{
    try {
        var timePeriod = req.body.timePeriod;
        var priceHistory =[]
        const responseTimePeriod = await axios.get("https://api.coinranking.com/v2/coin/"+req.body.uuid+"/history?timePeriod="+timePeriod, config);
        const response = await axios.get(API_URL+"coin/"+req.body.uuid,config);
        responseTimePeriod.data.data.history.forEach((item) => {
            priceHistory.push(item.price)
        });
        var sparklineArray = []
        var sparkline  = priceHistory.slice(0,priceHistory.length-1);
        sparkline.forEach((item)=>{
            sparklineArray.push(Number(item));
        })
        var coin = response.data.data.coin;
        res.render("coinDetails.ejs",
            {
                uuid: req.body.uuid,
                name: coin.name,
                price: coin.price,
                description: coin.description,
                change: responseTimePeriod.data.data.change,
                allTimeHigh: coin.allTimeHigh.price,
                high: Math.max(...sparklineArray),
                low: Math.min(...sparklineArray),
                sparkline: JSON.stringify(sparklineArray),
                btcPrice: coin.btcPrice,
                rank: coin.rank,
                $24hVolume: coin['24hVolume'],
                marketCap: coin.marketCap,
                fullyDilutedMarketCap: coin.fullyDilutedMarketCap,
                circulating: coin.supply.circulating,
                total: coin.supply.total,
                max: coin.supply.max,
                links: coin.links,
                iconUrl: coin.iconUrl,
                color: coin.color,
                symbol: coin.symbol,
                period: req.body.timePeriod,
            }
        )
    } catch (error) {
        console.log(error.message);
    }
})

app.get("/home", (req,res)=>{
    res.redirect("/");
})

app.get("/github", (req,res)=>{
    res.redirect("https://github.com/Arunjangir8")
})

app.get("/contact", (req,res)=>{
    res.redirect("https://arunjangir8.github.io/portfolio2.0/");
})

app.listen(port, ()=>{
    console.log(`Server started at port ${port}.`);
})