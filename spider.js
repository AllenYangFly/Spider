var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var i = 0;
var url = "http://www.hlju.edu.cn/info/1054/1292.htm"; 

function fetchPage(x) {     
    startRequest(x); 
}


function startRequest(x) {
       
    http.get(x, function (res) {     
        var html = '';        
        var titles = [];        
        res.setEncoding('utf-8'); //防止中文乱码
        
        res.on('data', function (chunk) {   
            html += chunk;
        });
        
        res.on('end', function () {

         var $ = cheerio.load(html); 

         var time = $('form .box_date').text().trim();

         var news_item = {
            
            title: $('form h1').text().trim(),
            
            Time: time,   
           
            i: i = i + 1,     
            url: "http://www.hlju.edu.cn/info/1054/" + $(".box_down a").eq(0).attr('href')
          };

          console.log(news_item);     
          var news_title = $('form h1').text().trim();

          savedContent($, news_title);  

         

          var nextLink="http://www.hlju.edu.cn/info/1054/" + $("div.box_down a").eq(0).attr('href');

          str = encodeURI(nextLink);  
          
          if (i <= 50) {                
              fetchPage(str);
          }

        });

    }).on('error', function (err) {
        console.log(err);
    });

}

function savedContent($, news_title) {

    $('form h1').each(function (index, item) {
        var x = $(this).text();    
        var text = $('form p').text();   
        x = x + '\n';   
        fs.appendFile('./data/' + news_title + '.txt', text, 'utf-8', function (err) {
            if (err) {
                console.log(err);
            }
        });
   
    })
}

function savedImg($,news_title) {
    $('.article-content img').each(function (index, item) {
        var img_title = $(this).parent().next().text().trim();  
        if(img_title.length>35||img_title==""){
         img_title="Null";}
        var img_filename = img_title + '.jpg';

        var img_src = 'http://www.ss.pku.edu.cn' + $(this).attr('src'); 

        request.head(img_src,function(err,res,body){
            if(err){
                console.log(err);
            }
        });
        request(img_src).pipe(fs.createWriteStream('./image/'+news_title + '---' + img_filename));     //通过流的方式，把图片写到本地/image目录下，并用新闻的标题和图片的标题作为图片的名称。
    })
}
fetchPage(url); 