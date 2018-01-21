var phantom = require('phantom');
const express = require('express')
const app = express()

phantom.create().then(function(ph) {

    app.get('/', function (req, res) {

        ph.createPage().then(function(page) {
            var url = "https://allegro.pl/kategoria/seria-3-e46-1998-2007-18077?order=dd&pojemnosc-silnika-cm3-od=2700&pojemnosc-silnika-cm3-do=2900&nadwozie=Sedan#time=20180114175200";
            page.open(url).then(function(status) {
              console.log(status);
        
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
                console.log(ads);
                res.send(ads)
              });
              page.close();
            });
          });
    })

    app.listen(3000, () => console.log('Example app listening on port 3000!'))

});