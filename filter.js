var express = require("express");
var bodyParser = require("body-parser");
var app = express();

var MongoClient = require('mongodb').MongoClient;

const dbName = 'cdpInsta';  // user can change DB name here
const collectionName = 'posts';

var url = 'mongodb://localhost/' + dbName;
var str = "";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


/**********************************************************************************************************/
/** function filter():  search JSon file stored in MongoDB by using 'Key/Value' sets and/or City/Country ***/
/**********************************************************************************************************/

// url -- MongoDB URL
// collection_name -- JSon file stored in the MongoDB
// key_value_sets :  {key1:value1, key2:value2, key3:value3, key4:value4, key5:value5} for filtering
// andor_operator:  AND/OR operator
// city:   city name for filtering
// country: country name for filtering
// callback:  callback function for filtering results

/**************** Usage ***********************************************************************************
    
	.........
	
	filter(url, collection_name, key_value_sets, andor_operator, city, country, function(results)
	{
	      console.log(results); // list information of the filtered JSon objects
		  // do something here;
	
	});
	
	.........
	
************************************************************************************************************/

function filter(url, collection_name, key_value_sets, andor_operator, city, country, callback)
{
    MongoClient.connect( url, function(err, db) 
    {
        var myfunctions = require('./functions.js'); // functions.js in the same folder as this file
        var getAllkeys = myfunctions.getAllkeys;
        var getCoordinates=myfunctions.getCoordinates;
        var getLatLonKey = myfunctions.getLatLonKey;                 
        var getKeyList= myfunctions.getKeyList;
        var get_OR_QueryStr= myfunctions.get_OR_QueryStr;                 
        var getGeoLatLon=myfunctions.getGeoLatLon;
		var matchLocation=myfunctions.matchLocation;
		
		var key1='', key2='', key3='', key4='', key5='';
		var val1='', val2='', val3='', val4='', val5='';
                                  
        var collection = db.collection(collection_name);
	
        collection.findOne({},function(err,item)
        {	
            var list = getKeyList(item);
                    
            var and_or = andor_operator;
                    
            var query1={};  // for query string
            var query2={};
            var query3={};
            var query4={};
            var query5={};
            var query={};
                    
            var operator=[];
            var expression={};
            var key_str='';

			var count=0;
			for(key in key_value_sets)
			{
				if(count == 0)
				{
					key1 = key;
					val1 = key_value_sets[key];
				}
				if(count == 1)
				{
					key2 = key;
					val2 = key_value_sets[key];
				}
				if(count == 2)
				{
					key3 = key;
					val3 = key_value_sets[key];
				}
				if(count == 3)
				{
					key4 = key;
					val4 = key_value_sets[key];
				}
				if(count == 4)
				{
					key5 = key;
					val5 = key_value_sets[key];
				}
				count++;
			}
			
			
                        
            //get all keys (eg. match 'id' in Object) with path
            var keys1 = getAllkeys(item,  key1);
            var keys2 = getAllkeys(item,  key2);
            var keys3 = getAllkeys(item,  key3);
            var keys4 = getAllkeys(item,  key4);
            var keys5 = getAllkeys(item,  key5);
            //get the key for geolocation, return value (geokey) as ['1', 'xxxx.coordinates']  or ['2', 'xxxx.lat', 'xxxx.lon'] 
            var geokey = getLatLonKey(item);
                  
            count = 0;
            if(key1==''&& val1==''&& key2==''&& val2==''&& key3==''&& val3==''&& key4==''&& val4==''&& key5==''&& val5=='')
            {
                query={}; 
            }
            else 
            {
                if(val1 != '' && key1 != '')
                {
                    query1=get_OR_QueryStr(keys1 ,val1);
                    if(query1 != null)
					{
                        operator.push(query1);
                        console.log(query1);
                                
                    }
                    count++;
                }

                if(val2 != '' && key2 != '')
				{
                    query2=get_OR_QueryStr(keys2,val2);
                    if(query2 != null)
					{
                        operator.push(query2);
                        console.log(query2);
                            
                    }
                    count++;
                }

                if(val3 != '' || key3 != '')
				{
                    query3=get_OR_QueryStr(keys3,val3);
                    if(query3!=null)
					{
                        operator.push(query3);
                                
                    }
                        count++;
                }
                if(val4 != '' || key4 != '')
				{
                    query4=get_OR_QueryStr(keys4,val4);
                    if(query4!=null)
					{
                        operator.push(query4);
                                
                    }
                    count++;
                }
                if(val5 != '' || key5 != '')
				{
                    query5=get_OR_QueryStr(keys5,val5);
                    if(query5!=null)
					{
                        operator.push(query5);
                                
                    }
                    count++;
                }

                console.log('count='+count+' Operator length='+operator.length)
                                
                if(operator.length==1)
                {

                    query=operator[0];  
                }
                else
                {
                    if(and_or == 'And')
                        query['$and']=operator;
                    else
                        query['$or']=operator;

                }
                console.log(query);
            }			
			
			
                        // filter by using the 'query' string 
            collection.find(query).limit(1000).toArray(function(err, result)
            {
                if(err) throw err;
                             
                if(result.length == 0)
                {   
                    console.log('No record found');

                    db.close();
                    callback(result);
                }
                else if(country!='') 
                {
                                     
                    var NodeGeocoder = require('node-geocoder');
                    var options = {
                            provider: 'google',
                            httpAdapter: 'https',
                            apiKey: '',
                            formatter: null
                        };
                     
                    var geocoder = NodeGeocoder(options);     
                                    
                    latlon_array=[];
                    var latlon=[];
                                    
                                    
                    for(var i=0;i<result.length;i++)
                    {                        
                        var geo_latlon={};
                        latlon=getGeoLatLon(result[i],geokey);
                        geo_latlon['lat']=latlon[0];
                        geo_latlon['lon']=latlon[1];
                        latlon_array.push(geo_latlon);
                    }

                    matchLocation(result, geocoder, latlon_array, city, country, function(ret)
                    {
                        var obj=[];
                        console.log(ret);
                                        
				        if(ret.length>0)
                        for(var k=0;k<ret.length;k++)
                        {
                            obj.push(result[ret[k]]);
                        }
                                        
                        if(obj.length>0)
                        {
                            db.close();
							callback(obj);
//                            res.render("index.ejs",{'obj':obj, 'geokey': geokey ,'keylist':list});
                                            
                        }                                        
                    });

                }
                else
                {
                    db.close();
					callback(result);
                                                               
                    //update the homepage, pass 'result' and 'geokey' to 'obj' and 'geokey' in 'index.ejs', seperately
//                    res.render("index.ejs",{'obj':result, 'geokey': geokey ,'keylist':list});
                }
                                             
            });             
			
			
			
		});	
	});
};
exports.filter=filter;

app.get("/home",function (req,res)
{
    res.render("filter.ejs");
});
app.post("/search",function(req,res)
{
    var val1=req.body.value1;
    var val2=req.body.value2;
    var val3=req.body.value3;
    var val4=req.body.value4;
    var val5=req.body.value5;
    var key1 = req.body.key1;
    var key2 = req.body.key2;
    var key3 = req.body.key3;
    var key4 = req.body.key4;
    var key5 = req.body.key5;
    var city = req.body.city;
    var country = req.body.country;
	var andor_operator = req.body.and_or;


    if(city=='' && country=='' && key1==''&& val1==''&& key2==''&& val2==''&& key3==''&& val3==''&& key4==''&& val4==''&& key5==''&& val5=='')
    {
        res.redirect("/home");
    }
    else if( (city!='') && (country=='') )
    {
        console.log('Oops! Please type Country Name!');
        res.redirect("/home?status=1");
          
    }
 
    else if((key1!=''&&val1 == '') || (key2!=''&&val2 == '') || (key3!=''&&val3 == '') || (key4!=''&&val4 == '') || (key5!=''&&val5 ==''))
    {
        console.log("Oops! Please type Value!");
        res.redirect("/home?status=2");
    }
    else
	{
		var key_value_sets={};
		if(key1!=''&&val1!=='')
			key_value_sets[key1]=val1;
		if(key2!=''&&val2!=='')
			key_value_sets[key2]=val2;
		if(key1!=''&&val1!=='')
			key_value_sets[key3]=val3;
		if(key1!=''&&val1!=='')
			key_value_sets[key4]=val4;
		if(key1!=''&&val1!=='')
			key_value_sets[key5]=val5;
		
		
		filter(url, collectionName, key_value_sets, andor_operator, city, country, function(result)
		{
			console.log(result);
			// do something starts here
			
			if(result.length==0)
				res.redirect("/home?status=0");
			else
				res.redirect("/home?records="+result.length);
			
		});
		
	}



});
app.listen(9999);

