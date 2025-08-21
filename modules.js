const http=require('http');
const fs=require('fs');
const_=require('lodash');
const server=http.createServer((req,res)=>{
    const num=_.random(0,20);
    console.log(num);
res.setHeader('Content-type','text/html');
let path='./views/';
switch(req.url){
    case '/':
        path+='about.html';
        res.statusCode=200;
        break;
        case '/about':
            path+='index.html';
            res.statusCode=200;

            break;
            case'/about-me':
            res.statusCode=301;
            res.setHeader('Location','/about');
            res.end();
            break;
            default:
            path+='404.html';
            res.statusCode=404
            break;
}
fs.readFile(path,(err,data)=>{
if(err){
console.log(err);
res.end();
}else{
    res.write(data);
    res.end();
}
})
});
server.listen(3007,'localhost',()=>{
    console.log('listen');
});
