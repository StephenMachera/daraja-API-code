import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';

const app=express();
const port =8088;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/" ,(req,res)=>{
    res.render("index.ejs");
});
const myBeaereToken="Fk3y7tpEys4I8wGH3IPXpY7pk3DL";
const config={
    headers:{Authorization:`Bearer ${myBeaereToken}`}
};
const date = new Date()
const timeStamp = date.getFullYear()+("0"+(date.getMonth()+1)).slice(-2)+("0"+(date.getDate())).slice(-2)+("0"+date.getHours()).slice(-2)+("0"+date.getMinutes()).slice(-2)+("0"+date.getSeconds()).slice(-2);
const shortCode=174379;
const passkey="bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
const password = Buffer.from(shortCode+passkey+timeStamp).toString('base64');

let feedbackMessage="you have successfully made your payment";
app.post("/submit",async(req,res)=>{
    try {
        const amount=req.body.amount;
        console.log(amount);
        const phone=req.body.number;
        const response=await axios.post("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
            {
                "BusinessShortCode": shortCode,    
                "Password": password,    
                "Timestamp":timeStamp,    
                "TransactionType": "CustomerPayBillOnline",    
                "Amount": "1",    
                "PartyA":phone,    
                "PartyB":shortCode,    
                "PhoneNumber":phone,    
                "CallBackURL": "https://innovatorschoice.infinityfreeapp.com/?i=2",    
                "AccountReference":"Test",    
                "TransactionDesc":"Test"
            },
            config
        );
        console.log(response);
        res.render("index.ejs",{feedbackMessage})
    } catch (error) {
        res.status(404).send("bad request");
        console.log(error.response.data);
    }

})

app.listen(port,()=>{
    console.log(`the server is listening from port ${port}`);
})