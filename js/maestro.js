angular.module('starter')
.service("Maestro", ['$q', '$http', '$constants', 
        function ($q, $http, $constants) {
            var self = this;

            //Request Url and method
            var request = {
                url: $constants.restApiUrl,
        
                headers: {
                    "Content-Type": 'application/json'
                },
                params: {
                    'appId': $constants.appId,
                    'appSecret': $constants.appSecret
                
                }
            };

            

return {

/***********************************************************************************************************************************************/
          
          $pay_online : function (link)
           {
             var win = window.open(link+"?embed=form", '_blank', 'location=no, toolbar=yes, EnableViewPortScale=yes, clearcache=yes');             
             win.addEventListener("loadstart", function()
              {
                navigator.notification.activityStart("Please Wait, ", "Please do not press back or refresh this page....");
              });
              
                win.addEventListener("loadstop", function() 
                {
                  navigator.notification.activityStop();
                  win.executeScript({code: "localStorage.setItem('paymentobj','paymentstr');"});
                  var loop = $interval(function(){
                  win.executeScript({code: "localStorage.getItem('paymentobj');"},
                                      function(values)
                                      {
                                          var name = values[0];
                    paymentobj= JSON.parse(name); 
                    if((paymentobj.window)==='closed')
                    {
                      if(countp==1)
                      {
                         countp=0;
                        $scope.newvariable = name;
                        alert('name check : '+name);
                        localStorage.setItem('jobject',name);
                              
                      }
                      
                      win.executeScript({code: "localStorage.removeItem('paymentobj');"});
                          win.close();
                      $interval.cancel(loop);    
                    
                    }
                                      });
                                 },1000);                             
                  });


                win.addEventListener('exit', function() 
                {
                  var jobjects = localStorage.getItem('jobject');
                  if((jobjects!=null)&&(jobjects!="null"))
                  {
                      var jobjectp= JSON.parse(jobjects);
                      if(jobjectp.payment==="fail")
                      { 
                        //alert('shivam payment failed :');
                        var extra_data = localStorage.getItem('jobject');
                        localStorage.removeItem('jobject');
                        return localStorage.getItem('jobject');
                     //     $state.go('app.payment_step3', {orderId: orderId, transactionId: jobjectp.payment_id, status: 'failed'});
                      }

                      else if(jobjectp.payment==="done")
                      {
                        alert('shivam payment succeess');
                        var extra_data = localStorage.getItem('jobject');
                        localStorage.removeItem('jobject');
                        return extra_data;
                       // $state.go('app.payment_step3', {orderId: orderId, transactionId: jobjectp.payment_id, status:'done'});
                      }
                      else
                      {
                        //alert('yaha kabhi alert nahi aana chahiye');
                      }
                  }
                else
                { 
                    return 'canceled_by_user';            
                      //$state.go('app.payment_step3', {orderId: orderId, status: 'cancel'});
                     //$state.go('app.payment_step3', {orderId: '1', transactionId: '1', status:'done'});
                      alert('sflkfslf');        
                }
        })


              /*return $http({
                url : 'https://minbazaar.com/subs/admin/wp_instamojo_gate/payment.php',
                method: 'POST',
                params: data

              });*/
            },


           $get_payment_link : function (data)
           {  
              
              return $http({
                url : 'https://minbazaar.com/subs/admin/wp_instamojo_gate/payment.php',
                method: 'post',
                params: data

              });
          },         
          
          $get_next_day_need : function (data)
           {  
              alert('fhsfsfljflks');
              return $http({
                url : 'https://minbazaar.com/subs/admin/service/get_next_day_needs',
                method: 'GET',
                params: data

              });
          }, 


        $getPackages : function () {	//get all packages
	    		       return $http({ 
			           url:'https://www.minbazaar.com/subs/admin/service/get_packages',
			           method:'GET',
			     });
                
        },
        $pause_my_subscription : function (data, current_status) {   
                alert('current_status :'+current_status);
                return $http({ 
                 url:'https://www.minbazaar.com/subs/admin/service/pause_single_subscription/'+current_status,
                 method:'GET',
                 params: data
                });
            },

	    $getCategories : function () {	 //get all categories
	    		return $http({ 
			     url:'https://www.minbazaar.com/subs/admin/service/get_categories',
			     method:'GET',
	   	      	});
            },
            $getPackageProducts : function (id) { //get packages products and sizes by package id
            	 	return $http({ 
			     url:'https://www.minbazaar.com/subs/admin/service/get_package_product',
			     method:'GET',
			     params: {"pack_id":id}
			});
            },
            $getCategoryProducts : function (id) { //get categories products by category id          
             		return $http({ 
			     url:'https://www.minbazaar.com/subs/admin/service/get_products',
			     method:'GET',
			     params: {"cat_id":id}

			});
            },
            $getCustomerSubscriptions : function (id) { //get categories products by category id       
             		return $http({ 
			     url:'https://www.minbazaar.com/subs/admin/service/get_cust_subs',
			     method:'GET',
			     params: {"cust_id":id}

			});
            },
            $getCustomerAddresses : function (id) { //get categories products by category id       
			//alert('dffd');
             		return $http({ 
			     url:'https://www.minbazaar.com/subs/admin/service/get_customer_address',
			     method:'GET',
			     params: {"customer_id":id}

			});
            },
            $postAddresses : function (data) { //get categories products by category id       
			//alert('dffd');
             		return $http({ 
			     url:'https://www.minbazaar.com/subs/admin/service/post_address',
			     method:'GET',
			     params: data

			});
            },
            $add_new_subscription : function (data,action) { //get categories products by category id       
            //alert('dffd');
			return $http({ 
				url:'https://www.minbazaar.com/subs/admin/service/post_cust_subs'+action,
                 		method:'GET',
                 		params: data
            		});
	    },
            $create_order : function (data) { //create order     
			return $http({ 
				url:'https://www.minbazaar.com/subs/admin/service/create_order',
                 		method:'GET',
                 		params: data
            		});
	    },
            $getNextMenu : function (data) { //get categories products by category id       
			//alert('dffd');
             		return $http({ 
			     url:'https://www.minbazaar.com/subs/admin/service/get_next_day_selection',
			     method:'GET',
			     params: data

			});
            },
            $post_next_day_selection : function (data) { //get categories products by category id       
			//alert('dffd');
             		return $http({ 
			     url:'https://www.minbazaar.com/subs/admin/service/post_next_day_needs',
			     method:'GET',
			     params: data

			});
            },
            $addExtraQty : function (data) { //get categories products by category id       
			//alert('dffd');
             		return $http({ 
			     url:'https://www.minbazaar.com/subs/admin/service/add_extra_quantity',
			     method:'GET',
			     params: data

			});
            },
            $getSingleSub : function (data) { //get categories products by category id       
			//alert('dffd');
             		return $http({ 
			     url:'https://www.minbazaar.com/subs/admin/service/get_single_subs_data',
			     method:'GET',
			     params: data

			});

            },
             $billing : function (data) { //get categories products by category id       
                alert('dffd');
                return $http({ 
           url:'https://www.minbazaar.com/subs/admin/service/billing/customer',
           method:'GET',
           params: data

      });
                
            },
            $getSinglePackage : function (data) { //get categories products by category id       
             		return $http({ 
			     url:'https://www.minbazaar.com/subs/admin/service/get_single_package_data',
			     method:'GET',
			     params: data

			});
            },

            $getSubscribePackages : function (data) { //get categories products by category id       
			
             		return $http({ 
			     url:'https://www.minbazaar.com/subs/admin/service/check_subscription_alert',
			     method:'GET',
			     params: {cust_id:data}

			});
            },
            $get_orders : function (data) {   
                return $http({ 
                 url:'https://www.minbazaar.com/subs/admin/service/get_orders',
                 method:'GET',
                 params: {"cust_id" : data}
                });
	  },
	   $get_price_cart : function (data) {   
                return $http({ 
                 url:'https://www.minbazaar.com/subs/admin/service/get_cart_price',
                 method:'GET',
                 params: data
                });
	},

/***********************************************************************************************************************************************/
            $getProducts : function () {
		//alert("service");
              return $http({ 
			     url:'https://www.minbazaar.com/subs/admin/application',
			     method:'GET',
			     param:{miz:'heeeeeee'}

		});
                
            },
            $getslider : function () {
            return $http({
 			 url: 'https://minbazaar.com/wp_minb_webservices/fetch_slider.php',
  			method: 'POST',
  			transformResponse: function (data) {
      				// Do whatever you want!
      				return data;
  			}
		});
                
            },
            $getSections : function () {
		var paramaters={"auth_key":'ck_bca5ee0c5f916c12896590606abab1c4cee4cc08'};
            return $http({
 			 url: 'https://minbazaar.com/wp_minb_webservices/home_promo_categories.php',
 
  			method: 'POST',
			params: paramaters,
  			transformResponse: function (data) {
      				// Do whatever you want!
      				return data;
  			}
		});
                
            },
            $getBanners : function () {
		var paramaters={"auth_key":'ck_bca5ee0c5f916c12896590606abab1c4cee4cc08'};
            return $http({
 			 url: 'https://minbazaar.com/wp_minb_webservices/home_banner_images.php',
  			method: 'POST',
			params: paramaters,
  			transformResponse: function (data) {
      				// Do whatever you want!
      				return data;
  			}
		});
                
            },
            $getReviews : function (product_id) {

                  var parameters = angular.copy(request.params);
                if(product_id){
                    parameters.product_id = product_id;
                }
              return $http.get( request.url + '/list-product-reviews.php', {
                    params: parameters,
                    headers: {
                        "Content-Type": 'application/json'
                    }
                    
                })
                
            },
            $filterProduct : function (parameters) {
              return $http.get( 'http://www.minbazaar.com/wp_minb_webservices/list_filter.php', {
                    params: parameters,
                    headers: {
                        "Content-Type": 'application/json'
                    }
                    
                })
                
            },
            $getNotification : function (parameters) {
              return $http.get( 'http://www.minbazaar.com/wp_minb_webservices/user_notification.php', {
                    params: parameters,
                    headers: {
                        "Content-Type": 'application/json'
                    }
                    
                })
                
            },
            $doActionNotification : function (parameters) {
              return $http.get( 'http://www.minbazaar.com/wp_minb_webservices/mark_user_notification.php', {
                    params: parameters,
                    headers: {
                        "Content-Type": 'application/json'
                    }
                    
                })
                
            },
            $getMsgs : function (parameters) {
              return $http.get( 'http://www.minbazaar.com/wp_minb_webservices/Msgs.php', {
                    params: parameters,
                    headers: {
                        "Content-Type": 'application/json'
                    }
                    
                })
                
            },
            $getPincode : function (parameters) {
              return $http.get( 'https://www.minbazaar.com/wp_minb_webservices/pin_matching.php', {
                    params: parameters,
                    headers: {
                        "Content-Type": 'application/json'
                    }
                    
                })
                
            },
            $setReviews : function (parameters) {
		//alert('maestro' + JSON.stringify(parameters));
            		return $http.get(
 			'https://www.minbazaar.com/wp_minb_webservices/add_review.php',{
			params: parameters,
			header:{'Content-Type': "application/json"},
			transformResponse: function (data) {
      				// Do whatever you want!
				//alert(data);
      				return data;
  			}
		});
            },
            $applyCoupon : function (parameters) {
		//alert('maestro' + JSON.stringify(parameters));
            		return $http.get(
 			'https://www.minbazaar.com/wp_minb_webservices/apply_coupon.php',{
			params: parameters,
			header:{'Content-Type': "application/json"},
			transformResponse: function (data) {
      				// Do whatever you want!
				//alert("transform reques"+JSON.stringify(data));
      				return data;
  			}
		});
            },
            //Service Function to get products by category
            $getProductsByCategory : function (categoryId,page,sortby) {
		
                var parameters = angular.copy(request.params);
                if(categoryId){
                    parameters.category = categoryId;
		    parameters.page=page;
		    parameters.search_product="";
                }
		if(sortby){
		    parameters.SortBy=sortby;
		}

              return $http.get( request.url + '/list-products.php', {
                    params: parameters,
                    headers: {
                        "Content-Type": 'application/json'
                    }
                    
                })
                
            },
            $getFilterProductsByCategory : function (categoryId,page,sortby,filter) {
		
                var parameters = angular.copy(request.params);
                if(categoryId){
                    parameters.category = categoryId;
		    parameters.page=page;
		    parameters.search_product="";
                }
		if(sortby){
		    parameters.SortBy=sortby;
		}
		if(filter)
		 parameters.filter_object=filter;
              return $http.get( request.url + '/filter-products.php', {
                    params: parameters,
                    headers: {
                        "Content-Type": 'application/json'
                    }
                    
                })
                
            },
            //Service Function to get products by category
 $getAllProducts : function (data) {
              return $http.get('https://www.minbazaar.com/subs/admin/service/search', {
                params: {search: data},
                headers: {
                        "Content-Type": 'application/json'
                    }
                })
},
            $getSelectedAddresses : function (address_id) { //get categories products by category id       
                    return $http({ 
                 url:'https://www.minbazaar.com/subs/admin/service/get_customer_address',
                 method:'GET',
                 params: {"address_id": address_id}

            });
            },
            
            //Service Function to get products by id
            $getProductsById : function (productId) {
              
                var productParams = request.params;
                productParams.productId = productId;

                return $http.get( request.url + '/single-product.php', {
                    params: productParams,
                    headers: {
                        "Content-Type": 'application/json'
                    }
                    
                })

            },
            //Service Function to get products by id
            $createOrder : function (orderData) {
                 return $http.post( request.url + '/create-order.php',orderData, {
                    params: request.params,
                    headers: {
                        "Content-Type": 'application/json'
                    }                 
                })
            },
            //Service Function to get products by id
            $getOrderById : function (orderId) {

                var orderParams = request.params;
                orderParams.orderId = orderId;

                return $http.get( request.url + '/get-order.php', {
                    params: orderParams,
                    headers: {
                        "Content-Type": 'application/json'
                    }
                    
                })
            },
            //Service Function to get order by customerid
            $getOrderByCustomer : function (customerId) {
                var orderParams = request.params;
                orderParams.customer = customerId;

                return $http.get( request.url + '/list-orders.php', {
                    params: orderParams,
                    headers: {
                        "Content-Type": 'application/json'
                    }
                    
                })
            },
            //Service Function to update order
            $updateOrder : function (orderData) {
               

                return $http.post( request.url + '/update-order.php',orderData, {
                    params: request.params,
                    headers: {
                        "Content-Type": 'application/json'
                    }
                    
                })
            },
            //get customer by Id
            $getCustomerById : function (userId) {

		console.log(request.params);
                var customerParams = angular.copy(request.params);
                customerParams.userId = userId;

		console.log("Hitting webserviceeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
		console.log(request.url + '/get-customer.php');
		console.log(JSON.stringify(customerParams));
                return $http.post( request.url + '/get-customer.php',{}, {
                    params: customerParams,
                    headers: {
                        "Content-Type": 'application/json'
                    }
                    
                })
            },
            //update customer
        $updateCustomer : function (data) {

                //alert('hello :'+JSON.stringify(data));
                //var customerUpdateParams = angular.copy(request.params);
                //customerUpdateParams.userId = data.id;
                //shivam
                return $http.post( 'https://www.minbazaar.com/subs/admin/service/update_password',{
                    params: data,
                    headers: {
                        "Content-Type": 'application/json'
                    }
                    
                })
            },
	       $generateOTP : function (optObj) {
                 

        

                return $http.post( 'https://www.minbazaar.com/wp-content/plugins/minbazaar_user_authentication/external/send_otp.php',optObj,{
		  // data: optObj,//'auth_key=ck_bca5ee0c5f916c12896590606abab1c4cee4cc08&mobile_no=9424081993',
                  //  params: optObj,
                    headers: {
                        "Content-Type": 'application/json'
                    }
                    

                    
                })
            },
	       $validateOTP : function (optObj) {
                 

                

                return $http.post( 'https://www.minbazaar.com/wp-content/plugins/minbazaar_user_authentication/external/send_otp.php',optObj,{
		  // data: optObj,//'auth_key=ck_bca5ee0c5f916c12896590606abab1c4cee4cc08&mobile_no=9424081993',
                  //  params: optObj,
                    headers: {
                        "Content-Type": 'application/json'
                    }
                    

                    
                })
            },

}




        }
    ])
angular.module('starter').filter('setDecimal', function ($filter) {
    return function (input, places) {
        if (isNaN(input)) return input;
        // If we want 1 decimal place, we want to mult/div by 10
        // If we want 2 decimal places, we want to mult/div by 100, etc
        // So use the following to create that factor
        var factor = "1" + Array(+(places > 0 && places + 1)).join("0");
   return Math.round(input * factor) / factor;
    };
});

    
