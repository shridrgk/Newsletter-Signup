const express = require("express");
const app = express();
const request = require("request");
const http = require("http");
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
    const url = "http://us13.api.mailchimp.com/3.0/lists/eeed5d6736/"
    const options = {
        method: "POST",
        auth: "shrigk:3356f0b5b56bfcfba52fa58e2854f19f-us13"
    }



    const request = http.request(url, options, function (response) {


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
//3356f0b5b56bfcfba52fa58e2854f19f-us13

//listid
//eeed5d6736