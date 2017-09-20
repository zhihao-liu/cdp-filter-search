 
"use strict";


  var  _getAllkeys= function (obj, key)
    {
       var keys1=[];
       var obj1=[];
       var obj2=[];
       var obj3=[];
       var obj4=[];
       var str='';
      
       for(var item1 in obj)
       {
           if(typeof obj[item1] == 'object' && !Array.isArray(obj[item1]))
          {
              obj1 = obj[item1];
             
              for(var item2 in obj1)
              {
                  if(typeof obj1[item2] == 'object' && !Array.isArray(obj1[item2]))
                  {
                       obj2 = obj1[item2];
                        for(var item3 in obj2)
                        {
                           if(typeof obj2[item3] == 'object' && !Array.isArray(obj2[item3]))
                            {
                               obj3=obj2[item3];
                                for(var item4 in obj3)
                                {
                                   if(typeof obj3[item4] == 'object' && !Array.isArray(obj3[item4]))
                                    {
                                        obj4=obj3[item4];
                                        for(var item5 in obj4)
                                        {
                                            if(typeof obj4[item5] =='object' && !Array.isArray(obj4[item5]))
                                            {
                                            }
                                            else
                                            {
                                               if(item5 == key)
                                                {
                                                    str=item1+'.'+item2+'.'+item3+'.'+item4+'.'+item5;
                                                    keys1.push(str);
                                                }

                                            }
                                        }
                                    }
                                    else
                                    {
                                       if(item4 == key)
                                        {
                                           str=item1+'.'+item2+'.'+item3+'.'+item4;
                                            keys1.push(str);
                       
    //                                       keys1.push([item1,item2,item3,item4]);
    //                                        keys3.push(item2);
    //                                        keys3.push(item3);
    //                                        keys3.push(item4);
                                        }
                                    }
                                }
                            }
                            else
                            {
                               if(item3 == key)
                                {
                                    str=item1+'.'+item2+'.'+item3;
                                    keys1.push(str);
                                   
    //                                keys1.push([item1,item2,item3]);
    //                                 keys2.push(item2);
     //                                keys2.push(item3);                                 
                                }
                            }
                        }
                  }
                  else
                  {
                      if(item2 == key)
                      {
                        str=item1+'.'+item2;
                        keys1.push(str);
                    

    //                    keys1.push([item1,item2]);
    //                    keys1.push(item2);
                      }
                 
                  }
              }
          }
          else
          {
             if(item1 == key)
             {
                  str=str+key;
                  keys1.push(str);
                 
             }
          }

       }      
     
       return keys1;
      
      
    };


   var _getCoordinates= function (obj)
    {
       var keys=[];
       var keys1=[];
       var keys2=[];
       var keys3=[];
       var keys4=[];
       var obj1=[];
       var obj2=[];
       var obj3=[];
       var obj4=[];
       var str='';
	   var count1=0;
	   var count2=0;
	   var count3=0;
	   var count4=0;
	   var count5=0;
      
       for(var item1 in obj)
       {
           if(typeof obj[item1] == 'object' && !Array.isArray(obj[item1]))
          {
		      
              obj1 = obj[item1];
              count2=0;
              for(var item2 in obj1)
              {
                  if(typeof obj1[item2] == 'object' && !Array.isArray(obj1[item2]))
                  {
                       obj2 = obj1[item2];
					   count3=0;
                        for(var item3 in obj2)
                        {
                           if(typeof obj2[item3] == 'object' && !Array.isArray(obj2[item3]))
                            {
                               obj3=obj2[item3];
							   count4=0;
                                for(var item4 in obj3)
                                {
                                   if(typeof obj3[item4] == 'object' && !Array.isArray(obj3[item4]))
                                    {
                                        obj4=obj3[item4];
										count5=0;
                                        for(var item5 in obj4)
                                        {
                                            if(obj4[item5].isArray)
                                            {
                                               if(item5 == 'coordinates' && obj4[item5].length ==2)
                                                {
                                                   str=item1+'.'+item2+'.'+item3+'.'+item4+'.'+item5;
											        //str=String(count1)+'.'+String(count2)+'.'+String(count3)+'.'+String(count4)+'.'+String(count4);
													keys1.push(str);
                                                    break;
                                                }
                                            }
											count5++;
                                        }
                                    }
                                    else
                                    {
                                       if(item4 == 'coordinates' && obj3[item4].length==2)
                                        {
                                           str=item1+'.'+item2+'.'+item3+'.'+item4;
									        //str=String(count1)+'.'+String(count2)+'.'+String(count3)+'.'+String(count4);
                                            keys1.push(str);
    //                                       keys1.push([item1,item2,item3,item4]);
    //                                        keys3.push(item2);
    //                                        keys3.push(item3);
    //                                        keys3.push(item4);
                                            break;
                                        }
                                    }
									count4++;
                                }
                            }
                            else
                            {
                               if(item3 == 'coordinates' && obj2[item3].length==2)
                                {
                                    str=item1+'.'+item2+'.'+item3;
	//						        str=String(count1)+'.'+String(count2)+'.'+String(count3);
                                    keys1.push(str);
                                    break;
    //                                keys1.push([item1,item2,item3]);
    //                                 keys2.push(item2);
     //                                keys2.push(item3);                                 
                                }
                            }
							count3++;
                        }
                  }
                  else
                  {
                      if(item2 == 'coordinates' && obj1[item2].length==2)
                      {
                        str=item1+'.'+item2;
  //                      str=String(count1)+'.'+String(count2);
                        keys1.push(str);
                        break;

    //                    keys1.push([item1,item2]);
    //                    keys1.push(item2);
                      }
                 
                  }
				  
				  count2++;
              }
			  
          }
          else
          {
             if(item1 == 'coordinates' && obj[item1].length==2)
             {
                  keys1.push(item1);
//                  keys1.push(String(count1));
                  break;
             }
          }
          count1++;
       }
      
       return keys1; 
      
    };
	
	
  var  _getAllPathsOfMatchedkeys= function (obj, key)
    {
       var keys=[];
       var keys1=[];
       var keys2=[];
       var keys3=[];
       var keys4=[];
       var obj1=[];
       var obj2=[];
       var obj3=[];
       var obj4=[];
       var str='';
 	   var count1=0;
	   var count2=0;
	   var count3=0;
	   var count4=0;
	   var count5=0;     
       for(var item1 in obj)
       {
           if(typeof obj[item1] == 'object')
          {
              obj1 = obj[item1];
              count2=0;
              for(var item2 in obj1)
              {
                  if(typeof obj1[item2] == 'object')
                  {
                       obj2 = obj1[item2];
					   count3=0;
                        for(var item3 in obj2)
                        {
                           if(typeof obj2[item3] == 'object')
                            {
                               obj3=obj2[item3];
							   count4=0;
                                for(var item4 in obj3)
                                {
                                   if(typeof obj3[item4] == 'object')
                                    {
                                        obj4=obj3[item4];
										count5=0;
                                        for(var item5 in obj4)
                                        {
                                            if(typeof obj4[item5] !='object')
                                            {
                                               if(item5 == key)
                                                {
//                                                str=item1+'.'+item2+'.'+item3+'.'+item4+'.'+item5;
                                                   str=String(count1)+'.'+String(count2)+'.'+String(count3)+'.'+String(count4)+'.'+String(count5);
                                                   keys1.push(str);
                                                }
                                            }
											count5++;
                                        }
                                    }
                                    else
                                    {
                                       if(item4 == key)
                                        {
                                           str=String(count1)+'.'+String(count2)+'.'+String(count3)+'.'+String(count4);
                                            keys1.push(str);
                       
    //                                       keys1.push([item1,item2,item3,item4]);
    //                                        keys3.push(item2);
    //                                        keys3.push(item3);
    //                                        keys3.push(item4);
                                        }
                                    }
									count4++;
                                }
                            }
                            else
                            {
                               if(item3 == key)
                                {
//                                    str=item1+'.'+item2+'.'+item3;
                                    str=String(count1)+'.'+String(count2)+'.'+String(count3);
                                    keys1.push(str);
                                   
    //                                keys1.push([item1,item2,item3]);
    //                                 keys2.push(item2);
     //                                keys2.push(item3);                                 
                                }
                            }
							count3++;
                        }
                  }
                  else
                  {
                      if(item2 == key)
                      {
//                        str=item1+'.'+item2;
                        str=String(count1)+'.'+String(count2);
                        keys1.push(str);
                       

    //                    keys1.push([item1,item2]);
    //                    keys1.push(item2);
                      }
                 
                  }
				  count2++;
              }
          }
          else
          {
             if(item1 == key)
             {
//                  str=str+key;
                  str=str+String(count1);
                  keys1.push(str);
                 
             }
          }
		  count1++;

       }
      
      
      
     
       return keys1;
      
      
    };
	
	
   
  var  _getLatLonKey= function (obj)
    {
         
		 
		 var keys=[]; 
         var lat_keys=[];
         var lon_keys=[];
         var lat_str=[];
         var lon_str=[];
         var found=0;
         var ll_found=false;
         var geokey=[];
         
		 keys = module.exports.getCoordinates(obj);

         if(keys == null)
         {
              lat_keys=getAllkeys(obj,'lat');
              if(lat_keys != null)
              {
                  lon_keys=getAllkeys(obj,'lng');
                  if(lon_keys != null)
                  {
                       ll_found=true;
                  }
                  else
                  {
                       lon_keys=getAllkeys(obj,'lon');
                       if(lon_keys != null)
                       {
                            ll_found=true;
                       }
                  }
              }
              else
              {  
                  lat_keys=getAllkeys(obj,'latitude');
                  if(lat_keys != null)
                  {
                       lon_keys=getAllkeys(obj,'longtitude');
                       if(lon_keys != null)
                      {
                           ll_found=true;
                      }
                  }
                  
              }
             
         }
         else
         {
            
              found=1; // key = 'coordinate'
              }
            
         
         if(found == 0)
         {
              if(ll_found == true)
              {
                   lat_str = lat_keys[0].split('.');
                   lon_str = lon_keys[0].split('.');
                  
                   if( lat_str.length == lon_str.length ) // check if the length is the same
                   {
                       if(lat_str.length>1)
                       {
                            for(var i=0; i<lat_str.length-1; i++)
                            {
                                if(lat_str[i]!=lat_str[i]) //check if the path is the same
                                {
                                     ll_found=false;
                                     break;
                                }
                            }
                       }
                   }
              }
              if(ll_found == true) // lat and lon are at the same path with the same length
              {
                  found = 2;
              }
         }
         
         if(found>0) //found the geolocation
         {
             if(found == 1)   // returns like: 1, xx.xxx.coordinates
             {
                 geokey.push('1');
                 geokey.push(keys[0]);
             }
             if(found == 2)  // returns like: 2, xx.xxx.lat, xx.xxx.lon
             {
                 geokey.push('2');
                 geokey=geokey.concat(lat_keys[0]);
                 geokey=geokey.concat(lon_keys[1]);
             }
             
         }
         
         return geokey;
         
    };
	
  var _find_duplicate_in_array=function(arra1) {
	  var i,
	  len=arra1.length,
	  result = [],
	  obj = {}; 
	  for (i=0; i<len; i++)
	  {
	  obj[arra1[i]]=0;
	  }
	  for (i in obj) {
	  result.push(i);
	  }
	  return result;
  }	
	
  var  _getKeyList= function (obj)
  {
           var list=[''];
     for(var key in obj){
	    if (!obj.hasOwnProperty(key)) continue;
        if(typeof obj[key]==='object' && !Array.isArray(obj[key]))
		{
            list=list.concat( _getKeyList(obj[key]));
        } else if(!parseInt(key) && key!= '0')
		{
		    if(key.length<=20 && key.length>0)
			if(list.indexOf(key)==-1)
		    list.push(key);
		}
     }
	 list = module.exports.find_duplicate_in_array(list);
     return list;    
  };
  
  var _get_OR_QueryStr= function (keys1, value1)
  {
       var query={};
 					var operator=[];
					var expression={};	   
  					if(keys1 == null)
					{
						 console.log('No key is found');
					}
					else
					{
						 if(keys1.length==1)  // only one key found, generate 'query' like {'id_str': 'wwwww'} 
						 {
    						     if(parseInt(value1) || parseFloat(value1)) // check if the input string is numeric
         						         query[keys1[0]]=Number(value1);
							       else if(value1=='0')
                                         query[keys1[0]]=0;
								   else if(value1.toLowerCase() == 'true')
										 query[keys1[0]]=true;
								   else if(value1.toLowerCase() == 'false')
										 query[keys1[0]]=false;									 
                                   else
	    	    			    	     query[keys1[0]]=value1;
						 }
						 else  					// generate 'query' string like: { '$or': [{id:'1234'}, {'user.id':'1234'}]}
						 // which either id = 1234 or user.id = 1234 is true then the return is TRUE
						 {
                                if(parseInt(value1) || parseFloat(value1)) // check if the input string is numeric
                                     value1=Number(value1);
                                if(value1=='0')
                                     values1=0;
								if(value1.toLowerCase() == 'true')
										 value1=true;
								if(value1.toLowerCase() == 'false')
										 value1=false;									 
    							 for(var i=0; i<keys1.length; i++)
	    						 {
								      expression[keys1[i]]=value1;
								      operator.push(expression);
								      expression={};
		    					 }
			    		    	 query['$or']=operator;
						}
					}

		return query;

  };
  
var _getDeepPathObj=function(obj, key_path)
{
     var object=obj;
     
     var path = key_path.split('.');
     
     for(var i=0;i<path.length;i++)
     {
         object=object[path[i]];
     }
     
     return object;
};
  
var _getGeoLatLon=function (obj, geokey)
{
     var lat_object=obj;  // for latitude
     var lon_object=obj;  // for longitude
     var object = obj;  // for coordinates
     var latlon=[];
     if(geokey!=null)
     {
          if(geokey[0]=='1')
          {
             object = module.exports.getDeepPathObj(obj,geokey[1]);


            if(!Array.isArray(object))
                 object=object['coordinates'];

             latlon[0]=object[1];
             latlon[1]=object[0];
     
          }
          else
          {
             lat_object = getDeepPathObj(obj,geokey[1]);
             lon_object = getDeepPathObj(obj,geokey[2]);
             latlon[0]=lat_object[0];
             latlon[1]=lon_object[0];             
          }
     }
      
          return latlon;
};

var _matchLocation=function(obj, geocoder, latlon_array, city, country, callback)
{
    var forEach = require('async-foreach').forEach;                     
    var count = 0;
	var location_matched=0;
    var ret=[];  

    forEach(latlon_array, function(item, index,arr)	
 //   for(var i=0;i<latlon_array.length;i++)
    {                        
        console.log('out: ',item);
        geocoder.reverse(item,function(err, res) 
        {
            var google_city=null;

            console.log(item,index);
            
            if(err)
            { 
                callback(err);
                return;
            }

           if((city!='' && country!='' ))
           {
               if(res[0].hasOwnProperty('city'))
                   google_city=res[0]['city'].toLowerCase();
               else if(res[0]['administrativeLevels'].hasOwnProperty('level2long'))
                   google_city = res[0]['administrativeLevels']['level2long'].toLowerCase();
               else
                   google_city ='Google City';
               if( (google_city.indexOf(city.toLowerCase())!=-1 && (country.toLowerCase()==res[0]['country'].toLowerCase() || country.toLowerCase()==res[0]['countryCode'].toLowerCase())) )
               {        
                     location_matched=1;
//                    ret.push('1');
                    ret.push(index);
                    console.log(ret);
                }
                else
                {
                   location_matched=0;
//                   ret.push('0');
                }
           }
           else if(city=='' && country!='')
           {
               if( (country.toLowerCase()==res[0]['country'].toLowerCase() || country.toLowerCase()==res[0]['countryCode'].toLowerCase())) 
               {
                    location_matched=1;
//                    ret.push('1');
                    ret.push(index);
               }
                else
                {
                    location_matched=0;
   //                 ret.push('0');
                }
           }
            else
            {
                location_matched=0;
     //           ret.push('0');
            }
            
            
            if(++count==latlon_array.length)
                  callback(ret);
            
        });  
//        geo_latlon={};        
    });            
}





 module.exports={
   getAllkeys: _getAllkeys,
   getCoordinates: _getCoordinates,
   getAllPathsOfMatchedkeys: _getAllPathsOfMatchedkeys,
   getLatLonKey: _getLatLonKey,
   find_duplicate_in_array: _find_duplicate_in_array,
   getKeyList: _getKeyList,
   get_OR_QueryStr: _get_OR_QueryStr,
   getDeepPathObj: _getDeepPathObj,
   getGeoLatLon: _getGeoLatLon,
   matchLocation: _matchLocation
   };   
   
//};