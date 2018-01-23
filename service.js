var phantom = require('phantom');
const express = require('express')
const app = express()

var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer(); // for parsing multipart/form-data

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded



    app.post('/', upload.array(), function (req, res, next) {
      // ph start
      phantom.create().then(function(ph) {

      var startProcessDate = new Date();
      // console.log(req.body);
      url = req.body.url;

        ph.createPage().then(function(page) {
            page.open(req.body.url).then(function(status) {
              // console.log(status);
        
              page.injectJs("jquery.min.js");
              page.evaluate(function() {
                var ads = [];
                $("h2:contains('lista ofert')").parents("section").find("article").each(function()
                {
                  ads.push({
                    "title": $(this).find("h2 a").text(),
                    "url": $(this).find("h2 a").attr("href"),
                    "price": $(this).find("div div span span:contains(' zł')").text()
                    });
                });
                return ads;
              }).then(function(ads){
                // console.log(ads);
                console.log("Evaluate page: " +url +"\n[" +(new Date() - startProcessDate) +" ms]");
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ content: ads }));
              });
              page.close();
            });
          });

          // ph esit
          phantom.exit();
          });
    })

    app.listen(60000, () => console.log('Example app listening on port 60000!'));
