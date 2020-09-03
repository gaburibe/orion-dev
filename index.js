var express = require('express');
var app = express();
var bodyParser = require('body-parser')
const dotenv = require('dotenv');
dotenv.config();
var Crawler = require("crawler");
var async = require("async");
var pdf = require('html-pdf');
const multer = require('multer');
const csv = require('fast-csv');
_ = require('underscore');
const readline = require('readline');
const cors = require("cors");


//          (_    ,_,    _) 
//          / `'--) (--'` \
//         /  _,-'\_/'-,_  \
//        /.-'     "     '-.\
//         Julia Orion Smith

const port = 1313; 
const _K = "MTIzNHx8b3Jpb24="; 
var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', express.static(__dirname + '/sitio'));
app.use('/bandeja/', express.static(__dirname + '/bandeja'));
app.use('/ordenes/', express.static(__dirname + '/ordenes'));
app.use('/archivo/', express.static(__dirname + '/archivo'));

var fs = require("fs");
var path = require('path');
var menuManager = require('./menuManager');
var _ZONAS={};
var printingSystem = require('./printingSystem');
var mailerSystem = require('./mailer');
var kokoro = require('./dbindex');
//console.log("public",__dirname + '/sitio')


kokoro.connectDB();
menuManager.inicializa();
makezones();




function makezones(){
	IN_file="mensajeria/zonas.csv";
	rownum=0;
	obj={}
	obj2={}
	csv
	 .parseFile(IN_file,{ delimiter:';'})  //BUG BIZARRO !!!
	 .on("data", function(data){
	 	if(rownum==0){}
	 	else{
	 		obj[data[0]]=[ data[1],data[3],data[4] ];

	 	}
	 	rownum+=1;
	 		 	
	 })	
	 .on("end", function(){
	 	_ZONAS=obj;
	 	//return (obj);
	 	// this.codigosPostales=obj;
	 	// console.log("_zones loaded_",this.codigosPostales)
	 })
}

//ORDENES
app.post('/orden', function (req, res) {
  //console.log(req.body);
  name=req.body["username"].substring(0,4)+"__"+Math.floor(Math.random() * 100)+Math.floor(Date.now() / 60000);
  fs.writeFile("ordenes/"+name+".json",JSON.stringify(req.body) , function(err) {
	    if(err) {
	        return console.log(err);
	    }
	    else{
	    	menuManager.actualiza(req.body.orden,function(){
	    		menuManager.updateCache(menuManager.liveMenu);
	    	});
	    	console.log("Orden "+name+" procesada");
	    	//return name;
	    	res.json({"orden":name});
	    }
	    
	}); 
  
});
app.post('/ordenview', function (req, res) {
  //console.log(req.body);
  nombreorden=req.body["nombre"];
  menuManager.getOrden(nombreorden, function(orden){
  		res.json(orden);
  });
});

//MENÚ
app.get('/menu', function (req, res) {
	if( !isEmpty(menuManager.liveMenu) ){
		//console.log("live");
		res.json(menuManager.liveMenu);
	}
	else{
		menuManager.menu(function(menuR){
			menuManager.updateCache(menuR);
			res.json(menuR);
			console.log("initializing...");
		});
	}
	

});

//MENSAJERÍA
app.post('/checkcp', function (req, res) {
  console.log(req.body);
  cp=req.body["cp"];
  console.log(cp);
  res.send(_ZONAS[cp]);
});


//SITIO PRINCIPAL


app.get('/', function (req, res) {
	menudir="./menu/mainmenu.csv";
	if (!fs.existsSync(menudir)){
	   res.sendFile(path.join(__dirname + '/sitio/splash.html'));
	}
	else{
	   res.sendFile(path.join(__dirname + '/sitio/menu.html'));
	}	

});
app.get('/orden', function (req, res) {
	res.sendFile(path.join(__dirname + '/sitio/orderview.html'));

});

//LOGIN
app.get('/login', function (req, res) {
  res.sendFile(path.join(__dirname + '/sitio/login.html'));
});
app.get('/registro', function (req, res) {
  res.sendFile(path.join(__dirname + '/sitio/signup.html'));
});
app.get('/login', function (req, res) {
  res.sendFile(path.join(__dirname + '/sitio/login.html'));
});

//TEST
app.get('/hello', function (req, res) {
  res.sendFile(path.join(__dirname + '/sitio/staticindex.html'));
});
app.get("/kokorotest", (req, res) => {
  res.json({ message: "Welcome to Kokoro." });
});
//ADMIN
app.get('/adminPrint', function (req, res) {
	printsinglePDF(function(){
		console.log("printed");
		res.send("ok")
	});

});



function printsinglePDF(callback) {
thistime="";
	bandeja={};
	printed=0;
	var options = { format: 'A4' };
	printingSystem.print(function(htmls){
		fs.readdir("bandeja", function (err, files) {
			 admin={};
			 //thistime="";
			 header="";
			  if (err) {
		        console.error("Error stating file.", error);
		        return;
		      }
		      files.forEach(function (file, index) {

		      		name=file.replace(".pdf","");
		      		
			      	if(!file.includes(".DS")){
			      		bandeja[name]=1;
			      		console.log(name," ya procesado");
			      	}
			      	
		     });
			for(key in htmls){
				if(!bandeja[key] && printed<1){
					printed++;
					    pdf.create(htmls[key],{ format: 'Letter' }).toFile('./bandeja/'+key+'.pdf', function(err, res) {
							if (err){console.log(err);} else {console.log(res);callback();}
						});
				}
		      
			}
		  //     pdf.create(thistime).toFile('./bandeja/'+thistime+'.pdf', function(err, res) {
				// if (err){console.log(err);} else {console.log(res);}
			 //  });
		});
	});
}


//ORION sec layer
app.post('/orion/*', function (req, res, next) {
	_P=req.body["permission"];
	if(_P==_K){
	
		next();

	}
	else{
		res.send({"status":"err","err":"incorrect key"})
	}
});



// BACK
app.get('/operacion', function (req, res) {
	res.sendFile(path.join(__dirname + '/sitio/operacion.html'));

});
app.post('/orion/backconfirm', function (req, res) {
	nombreorden=req.body["nombre"];
	console.log("./ordenes/"+nombreorden)
	mailerSystem.testmail(nombreorden,function(mailst){
		console.log(mailst);
		fs.readFile("./ordenes/"+nombreorden, (err, data) => {
		    if (err) throw err;
		    let json = JSON.parse(data);

		    html=printingSystem.printSingle(nombreorden,json);
			pdf.create(html,{ format: 'Letter' }).toFile('./bandeja/'+nombreorden+'.pdf', function(err, result) {
				if (err){console.log(err);} else {console.log(result);}
				console.log('./bandeja/'+nombreorden+'.pdf',"CONFIRMED");
				res.sendStatus(200)
			});
			 
		});
	})
	
	
});
app.post('/orion/backunconfirm', function (req, res) {
	nombreorden=req.body["nombre"];
	fs.unlink("./bandeja/"+nombreorden+".pdf", function (err) {
	    if (err) throw err;
	    // if no error, file has been deleted successfully
	     res.sendStatus(200)
	}); 
});
app.post('/orion/backOrdenes', function (req, res) {
	menuManager.getOrdenesJson(function(ordenes){
  		res.send(ordenes);
  	});

});
app.post('/orion/ordenes', function (req, res) {
  menuManager.getOrdenes(function(ordenes){
  		res.send(ordenes);
		console.log("corte de caja...");
  });
});
app.post('/orion/resumen', function (req, res) {

  menuManager.getResumen(function(ordenes){
  		csvsend="Productor\t Producto\t total de unidades ordenadas\t total \n";
  		for (productor in ordenes){
  			for(producto in ordenes[productor]){
  				csvsend+=productor+"\t"+producto+
  				"\t"+ordenes[productor][producto][0]
  				+"\t"+ordenes[productor][producto][1]
  				+"\n";
  			}
  		}
  		res.send(csvsend);
		console.log("productores...");
  });
});

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

// OPERACIÓN  
app.get('/orionadmin', function (req, res) {
	res.sendFile(path.join(__dirname + '/sitio/admin.html'));
});
app.get('/back', function (req, res) {
	res.sendFile(path.join(__dirname + '/sitio/back.html'));
});
app.get('/status', function (req, res) {
	orderdir="./ordenes";
	bandejadir="./bandeja";
	menufile="./menu/mainmenu.csv";
	status={"ordenes":0,"bandeja":0,"menu":0}
	if (fs.existsSync(orderdir)){status.ordenes=1; }
	if (fs.existsSync(bandejadir)){status.bandeja=1; }
	if (fs.existsSync(menufile)){status.menu=1; }
	res.json(status);
});
app.post('/orion/uploadmenu', function (req, res) {
	
		newmenu=req.body["newmenu"];
		menuManager.uploadmenu(newmenu,function (respuesta){
			menuManager.liveMenu={};
			menuManager.menu(function(menuR){
				menuManager.updateCache(menuR);
				menuManager.inicializa();
				res.json(respuesta);
				console.log("initializing...");
			});
			
		});
	

});
app.post('/orion/closeShop', function (req, res) {

		menuManager.closeShop(function(err){
			if(!err){
				res.send({"status":"suave",});
			}
			else{
				res.send({"status":"err","err":err});
			}
			
		})
	
})
app.post('/orion/closeOp', function (req, res) {
	
		console.log("closing operation");
		menuManager.closeOp(function(err){
			if(!err){
				res.send({"status":"suave",});
			}
			else{
				res.send({"status":"err","err":err});
			}
			
		})
	
		
	
});

//MAILER

app.get('/testmail', function (req, res) {
	mailerSystem.testmail(function(error){
		if(error){res.send(error);}
		else{res.send("cool");}
	})
	
});
//DB



require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);


//PUERTO

console.log(`Your port is ${port}`);

app.listen(port, function () {
  console.log('Example app listening on port '+port+'!!!');
});


function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}