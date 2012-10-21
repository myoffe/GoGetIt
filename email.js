var nodemailer = require("nodemailer");

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        user: "myoffe@gmail.com",
        pass: new Buffer("ZW50ZXJ0aGV6b25l", 'base64').toString('ascii');
    }
});

exports.sendMail = function() {
    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: "Michael Yoffe <myoffe@gmail.com>", // sender address
        to: "myoffe@gmail.com, egozim@gmail.com", // list of receivers
        subject: "Go Get It Notification", // Subject line
        text: "Your favorite TV show is released, go get it!", // plaintext body
        html: "<b>Your favorite TV show is released, go get it!</b>" // html body
    }

    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }

        // if you don't want to use this transport object anymore, uncomment following line
        //smtpTransport.close(); // shut down the connection pool, no more messages
    });
};