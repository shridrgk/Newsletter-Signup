const express = require("express");
const app = express();
const request = require("request");
const https = require("https");
const bodyParser = require("body-parser");



app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"))
app.get("/", function (req, res) {

    res.sendFile(__dirname + "/signup.html")

});


app.post("/", function (req, res) {
    const firstName = req.body.fName
    const lastName = req.body.lName
    const email = req.body.email

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }

            }
        ]
    }

    const jsonData = JSON.stringify(data)
    const url = "https://us13.api.mailchimp.com/3.0/lists/eeed5d6736/"
    const options = {
        method: "POST",
        auth: "shrigk:38431b75fe39b6ac84a0a0f97cd40c69-us13"
    }



    const request = https.request(url, options, function (response) {


        console.log(response.statusCode)


        const chunks = []
        response.on('data', function (chunk) {
            chunks.push(chunk)
        })
        response.on('end', function () {
            const data = Buffer.concat(chunks)
            var got = JSON.parse(data)
            console.log(got)

            console.log(got.errors.length)
            if (got.errors.length == 0) {
                res.sendFile(__dirname + "/success.html")
            } else {
                res.sendFile(__dirname + "/failure.html")
            }

        })
    })

    request.write(jsonData)
    request.end()

})

app.listen(process.env.PORT || 3000, function () {
    console.log("server is running at 3000. ");
});

app.post("/failure", function (req, res) {
    res.redirect("/")
})

//api KEY
//38431b75fe39b6ac84a0a0f97cd40c69-us13

//listid
//eeed5d6736