angular.module('starter.controllers', [])

.controller('AppCtrl', function ($pinroUiService, $scope,$rootScope, $ionicModal,$rootScope, $ionicPopover,$timeout,$localStorage, $ionicScrollDelegate, StorageService, $state, Maestro, CartService, $ionicPopup,Dict, $ionicSlideBoxDelegate,  AuthService, State,Language) {

	var cart = angular.element(document.getElementsByClassName("shopping-cart"));
	var carts= CartService.getAll();
	var cartqty= 0;
	var errNotification="";
	$scope.readCount=0;
 	$scope.Notifications= [];
 	for(i=0;i<carts.length;i++){
    		cartqty=cartqty+carts[i].quantity;
 	}

	/*$scope.openSearchModal1 = function(){
		$state.go('app.search');
	}*/

  //$getNotification

	//$pinroUiService.showLoading();
	
	Maestro.$getSubscribePackages(AuthService.id()).then(function(res){	
		$scope.nextdaysselection=res.data.response_data;
//		alert(JSON.stringify($scope.nextdaysselection));
		//$scope.selectedSize={};
		//$scope.products=
		//$pinroUiService.hideLoading();
	})

	$scope.openNextDaySelection= function(package_id,package_size_id,subscription_id){
	//	alert(subscription_id);
		$state.go('app.nextdayselection',{package_id:package_id,package_size_id:package_size_id,subscription_id:subscription_id});
	}

	$scope.opensingle= function(){
		$state.go('app.singlesubscription');
	}
	$scope.getnotification=function(){
		$scope.errNotification="";
		var notificationObj={
			auth_key:'ck_bca5ee0c5f916c12896590606abab1c4cee4cc08',
			user_id:AuthService.id() // 
			//user_id:61			//hard code
		}
		Maestro.$getNotification(notificationObj).then(function(res){
			$scope.Notifications=res.data.notifications;
			if(!$scope.Notifications.length)
				$scope.errNotification="There are no Notifications for you";
			$scope.readCount=res.data.unReadCount;
			
		},
		function(err){
			
		})
	}
	$scope.getnotification();

	$scope.actionNotification=function(id,action){
			var notificationObj={
				auth_key:'ck_bca5ee0c5f916c12896590606abab1c4cee4cc08',
				notification_id:id,
				action:action			
			}
			$pinroUiService.showLoading();
			
			Maestro.$doActionNotification(notificationObj).then(function(res){
			
			$scope.getnotification();
			$pinroUiService.hideLoading();
			}, function(err){$pinroUiService.hideLoading();
			})
	}


  	$scope.closeNotificationModal = function () {
		var readIds=[];
		var count=0;
		for(var k=0; k<$scope.Notifications.length ; k++){
			if($scope.Notifications[k].status=="NEW"){
				if(count==0)
				   readIds=$scope.Notifications[k].notification_id;
				else
				   readIds=readIds+","+$scope.Notifications[k].notification_id;
    				count++;
			}
		}
		$scope.actionNotification(readIds,'read');

    	$scope.notificationModal.hide();
  	};

	$rootScope.cartlength=cartqty;
   	$scope.user = {	
        	id: AuthService.id(),
       		// username: AuthService.username(),
        	email: AuthService.email(),
        	name: AuthService.name(),
        	isLogin: AuthService.isAuthenticated()
    	};
	
    $rootScope.Dict = Dict[Language.getLang()];
	
   
//-----------------------------------------------------------------------------------------------------------------------------------------
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
   //var firstLaunch = true
  // $scope.$on('$ionicView.loaded', function(e) {
   $scope.openeditorial = function()
	{
		$state.go('editorial');
	};
    
   //});

  	$scope.$on("$ionicView.afterLeave", function (event, data) {
// handle event
    	//$ionicScrollDelegate.scrollTop();

  });

$scope.showPopup = function() {
  	$scope.data = {};
  // An elaborate, custom popup
  	var myPopup = $ionicPopup.show({
    		template: '<input type="text" ng-model="data.pin">',
    		title: 'Please! enter your zip/pin code',
    		subTitle: 'Currently available in select cities',
    		scope: $scope,
    		buttons: [
      				{ text: 'Cancel' },
      				{
        				text: '<b>Submit</b>',
        				type: 'button-dark',
        				onTap: function(e) {
         					if (!$scope.data.pin) {
            //don't allow the user to close unless he enters wifi password
            							e.preventDefault();
          					} else {
            						return $scope.data.pin;
          					}
        				}
				}      			
    			]
  		});


 		myPopup.then(function(res) {
			if(res.length==6 && isNaN(res)==false){
				check1 = res.substring(0, 4);
				if(check1==='4520')
					$state.go('app.product-list', {categoryId: 159, catagoryName: 'Grocery and Staples'});
				else{
					
					 $ionicPopup.alert({
     					title: 'Service not available',
     					template: 'This service is currently not available in your location',
    					 buttons: [
       						{ text: '<b>CLOSE</<b>',
      							type: 'button-small button-dark' }
     						]
   					});
				}
				
			}
			else
			{
					 $ionicPopup.alert({
     					title: 'Invalid Pin Code',
     					template: 'You have entered invalid zip/pin Code',
    					 buttons: [
       						{ text: '<b>CLOSE</<b>',
      							type: 'button-small button-dark' }
     						]
   					});
			}
  		});

 	};


  //go to product pages based on categories
  $scope.goToProductCategories = function(catagoryName, menuOrder, id){
  	$state.go('app.product-list', {categoryId: id, catagoryName: catagoryName});
  }
  

  //reload / refresh
$scope.reloadView = function(){
  console.log('reload');
  $state.reload();
}

//get userObj


  //logout
  $scope.logout = function () {
	AuthService.destroyUserCredentials();
	 $scope.user.isLogin = false;
     // $ionicSideMenuDelegate.toggleLeft();
      $state.go("signin", {}, {reload: true});
  }


  // Form data for the login modal
  $scope.loginData = {};



  $ionicModal.fromTemplateUrl('templates/modal/notification.html', {
    id: 'notification',
    scope: $scope
  }).then(function (modal) {
    $scope.notificationModal = modal;
  });


  $scope.openNotificationModal = function () {
    $scope.notificationModal.show();
  };


  // Create the search modal that we will use later
  $ionicModal.fromTemplateUrl('templates/modal/search-product.html', {
    id: 'search',
    scope: $scope
  }).then(function (modal) {
    $scope.searchModal = modal;
  });
  $scope.closeSearchModal = function () {
    $scope.searchModal.hide();
  };

  $scope.openSearchModal = function () {
    $scope.searchModal.show();
  };


  /*$scope.openSearchModal = function () {
	
   
  };*/

  // Create the wishlist modal that we will use later
  $ionicModal.fromTemplateUrl('templates/modal/wishlist.html', {
    id: 'wishlist',
    scope: $scope
  }).then(function (modal) {
    $scope.wishlistModal = modal;
  });
  $scope.closeWishlistModal = function () {
    $scope.wishlistModal.hide();
  };

  $scope.openWishlistModal = function () {
    $scope.wishlistModal.show();
  };


  $ionicModal.fromTemplateUrl('templates/modal/cart.html', {
    id: 'cart',
    scope: $scope
  }).then(function (modal) {
    $scope.cartModal = modal;
  	
  });
  $scope.closeCartModal = function () {
    $scope.cartModal.hide();
  };
//check if cart has items
var checkCartItems = function(){

  if(CartService.getAll().length){
    return true;
  }else{
    return false;
  }

}

//open cart modal
  $scope.openCartModal = function () {
    
    if(checkCartItems()){
       $scope.cartModal.show();
    }
    else{
       // An alert dialog
 $ionicPopup.alert({
     title: 'Your cart is empty',
     template: 'There are no items in your cart.',
     buttons: [
       { text: '<b>CLOSE</<b>',
      type: 'button-small button-dark' }
     ]
   });
  };

  }






// Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.cartModal.remove();
    $scope.searchModal.remove();
    $scope.wishlistModal.remove();
    $scope.profileModal.remove();
    $scope.settingsModal.remove();
    $scope.editProfileModal.remove();
    $scope.add_new_addressModal.remove();
  });


  // Create the profile modal that we will use later
                            $ionicModal.fromTemplateUrl('templates/modal/profile.html', {
                              id: 'profile',
                              scope: $scope
                            }).then(function (modal) {
                            
                              $scope.profileModal = modal;
                            
                            });
                            $scope.closeProfileModal = function () {
                              $scope.profileModal.hide();
                            };
                            $scope.openProfileModal = function () {
                              

                              $scope.profileModal.show();
                            };

                $ionicModal.fromTemplateUrl('templates/modal/settings.html', {
                  id: 'settings',
                  scope: $scope
                }).then(function (modal) {
                  $scope.settingsModal = modal;

                });
                $scope.closeSettingsModal = function () {
                  $scope.settingsModal.hide();
                };

                $scope.openSettingsModal = function () 
                {

                  $scope.settingsModal.show();
                };

                                        $ionicModal.fromTemplateUrl('templates/modal/edit-profile.html', {
                                          id: 'edit-profile',
                                          scope: $scope
                                        }).then(function (modal) {
                                          $scope.editProfileModal = modal;
                                        });
                                        $scope.closeEditProfileModal = function () {
                                          $scope.editProfileModal.hide();
                                        };

                                        $scope.openEditProfileModal = function () {
                                          $scope.editProfileModal.show();
                                        };

  $ionicModal.fromTemplateUrl('templates/modal/add_new_address.html', {
    id: 'add_new_address',
    scope: $scope
  }).then(function (modal) {
    $scope.add_new_addressModal = modal;
  });
  $scope.close_add_new_address_Modal = function () {

    $scope.add_new_addressModal.hide();
  };

  $scope.open_add_new_address_Modal = function () {
    
    $scope.add_new_addressModal.show();
  
  };



  // Create the change password modal
  $ionicModal.fromTemplateUrl('templates/modal/change-password.html', {
    scope: $scope
  }).then(function (modal) {
    $scope.changePasswordModal = modal;
  });
  $scope.closeChangePasswordModal = function () {
    $scope.changePasswordModal.hide();
  };

  $scope.openChangePasswordModal = function () {
    $scope.changePasswordModal.show();
  };

// Change Language modal
  $ionicModal.fromTemplateUrl('templates/modal/change-language.html', {
    scope: $scope
  }).then(function (modal) {
    $scope.selectLanguageModal = modal;
  });
  $scope.closeSelectLanguageModal = function () {
    $scope.selectLanguageModal.hide();
  };

  $scope.openSelectLanguageModal = function () {
    $scope.selectLanguageModal.show();
  };


  // Terms and conditions modal
  $ionicModal.fromTemplateUrl('templates/modal/terms.html', {
    scope: $scope
  }).then(function (modal) {
    $scope.termsModal = modal;
  });
  $scope.closeTermsModal = function () {
    $scope.termsModal.hide();
  };

  $scope.openTermsModal = function () {
    console.log('clicked');
    $scope.termsModal.show();
  };



  // Perform the login action when the user submits the login form
  $scope.doLogin = function () {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function () {
      $scope.closeSearchModal();
    }, 1000);
  };





//image zoom modal

$scope.allImages = [];

  $scope.zoomMin = 1;

  $scope.showImages = function(index, images) {
    console.log('clicked to show gallery');
    $scope.activeSlide = index;
    $scope.allImages = images;
    $scope.showModal('templates/modal/gallery-zoomview.html');
  };

  $scope.showModal = function(templateUrl) {
    $ionicModal.fromTemplateUrl(templateUrl, {
      scope: $scope
    }).then(function(modal) {
      $scope.galleryModal = modal;
      $scope.galleryModal.show();
    });
  }

  $scope.closeGalleryModal = function() {
    $scope.galleryModal.hide();
    $scope.galleryModal.remove()
  };

  $scope.updateSlideStatus = function(slide) {
    
    var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
    if (zoomFactor == $scope.zoomMin) {
      $ionicSlideBoxDelegate.enableSlide(true);
    } else {
      $ionicSlideBoxDelegate.enableSlide(false);
    }
  };






///controller over here hehe





  



})

// feed back controller----------------------------------------------------------------------------------------------------------------
.controller('feedbackCtrl', function ($scope, $ionicHistory,  $ionicPopup, $stateParams, $timeout, $dataService, StorageService, Maestro, $state, $ionicModal, $interval, AuthService) {
  $scope.fError="";
  $scope.User={};
	$scope.goback=function(){
		$ionicHistory.goBack(-1);
	}
  $scope.isloggedin = AuthService.isAuthenticated();
  $scope.validate = function(){


		filter = /^([a-zA-Z]{3,40})+$/;
		
		if($scope.User.first_name==null || $scope.User.last_name==null|| $scope.User.message==null)
			$scope.fError="All fields are required";

		else if (!filter.test($scope.User.first_name)){
			$scope.fError="Please enter a valid First Name";
		}
		else if (!filter.test($scope.User.last_name)){
			$scope.fError="Please enter a valid Last Name";
		}
		else if ($scope.User.email==undefined){
			$scope.fError="Please enter a valid Email";
		}
		else{
			$scope.fError="";
			
					 $ionicPopup.alert({
     					title: 'Thank You!',
     					template: 'Thank You For Your feedback!',
    					 buttons: [
       						{ text: '<b>ok</<b>',
      							type: 'button-small button-dark' }
     						]
   					});
			$state.go('app.editorial');

           	}
			
	}
})
.controller('SignUpCtrl', function ($scope, $pinroUiService, $stateParams, $timeout, $dataService, StorageService, Maestro, $state, $ionicModal, $interval,AuthService) {
	$scope.otpBtn="Validate Mobile";
	$scope.resend=true;
/*	$scope.timer=5; //resend otp seconds
	$scope.seconds=0;
	$scope.minutes=0;
	$scope.time=$scope.timer;*/
 	$scope.phoneNumbr = /^\d{10}$/;
	$scope.mobilevalid= false; 
	$scope.status1=false;    
	$scope.status2=false;	//mobile validation successfull
	$scope.status3=false;	//wrong otp message
	$scope.sendotp=false;
  	$scope.status4=true;
	$scope.pStrength=false;
	$scope.pStrengthText="";

	var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
	var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
  
	// style strength
	$scope.passwordStrength = {
		"width": "100%",
		"height": "10px"
	};
	
	$scope.analyze = function(value){
		if(value==''){
			$scope.passwordStrength["background-color"] = "white";
				$scope.pStrength=false;
				$scope.pStrengthText="Weak"
				
		}else if(strongRegex.test(value)){
			$scope.passwordStrength["background-color"] = "green";
				$scope.pStrengthText="Strong"
				$scope.pStrength=true;
				$scope.signUpError="";
		}else if(mediumRegex.test(value)) {
			$scope.passwordStrength["background-color"] = "orange";
				$scope.pStrengthText="Medium"
				$scope.pStrength=true;
				$scope.signUpError="";
		}else{
			$scope.passwordStrength["background-color"] = "red";
				$scope.pStrengthText="Weak"
				$scope.pStrength=false;
		}
	};  





	
		// show send/resend otp button			
	$scope.user = {		// declare user object
  //    		insecure: 'cool',
    //  		notify: 'no',
	//	mobile_num: null,
    	};
// Otp validation
/*	$scope.otpObj={auth_key:'ck_bca5ee0c5f916c12896590606abab1c4cee4cc08',
		validate: 'NO'
	};  
	
	$scope.showotpinput= function(){
       		return  $scope.status1;
   	}
	$scope.generateOTP = function(){
			
			//$scope.settime();
			if(($scope.user.mobile_number!=null)&&(!isNaN($scope.user.mobile_number)) && ($scope.user.mobile_number.length==10)){
						$scope.sendotp=true;
			$scope.status1=true; 
			$scope.otpBtn="Resend OTP";
			$scope.timerStart();
			$scope.otpObj.mobile_no=$scope.user.mobile_number;
			$scope.otpObj.validate= "YES";
			
			Maestro.$generateOTP($scope.otpObj).then(function (res) {
			//	
			});
   		}
		else {
  				$scope.status1=false;
 		}
    	}
	$scope.timerStart= function(){
		stop=$interval(function(){
					if($scope.time==0){
						$scope.time= $scope.timer;
						$scope.sendotp=false;
						$scope.resend=false;
						$interval.cancel(stop);	
						
					}					
					$scope.time--;
					$scope.minutes= parseInt(($scope.time)/60);
					if($scope.minutes<10)
						$scope.minutes='0'+$scope.minutes;
					$scope.seconds= parseInt(($scope.time)%60);
					if($scope.seconds<10)
						$scope.seconds='0'+$scope.seconds;					
						
				},1000);
	}
	$scope.validateOTP = function(){
        	$scope.otpObj.validate= "YES";
        	$scope.otpObj.OTP=$scope.user.otp;
        	//
		Maestro.$validateOTP($scope.otpObj).then(function (res) {
			if(res.data=="\n1"){
                   		$scope.status2=true;
		   		$scope.status3=false;
		   		$scope.status1=false;
		   		
		   		$scope.status4=false;
					
			}
			else{
		   		$scope.status2=false;
		   		$scope.status3=true;
			}
	});	
    }
*/
    $scope.$on("$ionicView.enter", function (event, data) {
      getNonce(); //get nonce for signUp
    });

    var getNonce = function () {
      	$scope.disableSubmit = true;
      	$dataService.$getNonce().then(function (res) {
        	console.log(res);
       	 //	$scope.user.nonce = res.data.nonce;
        	$scope.disableSubmit = false;

      	}, function (err) {
        	console.log(err)
      	})
    };

    $scope.disableSubmit = false;
    //signUp function--------------------------------------------------------------------------------------------------------------------
//shivam
    $scope.signUp = function () {
    
 //     alert(' : '+JSON.stringify($scope.user));
      

	//$scope.user.otp=786;
	//$scope.user.username=$scope.user.email;
	  

   // alert('fuckers: '+JSON.stringify($scope.user));

		if($scope.pStrength){
     		 	$scope.disableSubmit = true;
    			$scope.loading = true; //show loading

          $pinroUiService.showLoading();
      	   
           $scope.user.zip=0;

        	$dataService.$signup($scope.user).then(function (res) 
          { 
           // alert('res ....'+JSON.stringify(res));
        		if (res.data.response_data === 1) 
			       {
			 	  	  
  //            alert('fi ka andar');
	     

        $dataService.$login($scope.user).then(function (res1) {
        $pinroUiService.hideLoading(); 
//        			alert('fuckers :'+JSON.stringify(res1));

              if (res1.data && !res1.data.error) {
					 alert('inside if condition');
          AuthService.storeUserCredentials(res1.data.response_data);
					//localStorage.setItem('reloads',1);
          alert('jordon');
          				$state.go('app.editorial');		

        			}}); 
 
        		} 
			else {
          			$scope.signUpError = res.data.error;
				/*if(res.data.error=="Mobile already exists.")
				$scope.status4=true;*/
        		}
        		$scope.disableSubmit = false;
        		//$scope.loading = false;

      		}, function (err) {
			$pinroUiService.hideLoading();
        		console.log(err);
        		$scope.signUpError = err.data.error;
       		 	$scope.disableSubmit = false;
        		//$scope.loading = false;
      		})

	}
	else
	{
		$pinroUiService.hideLoading();
		$scope.signUpError="Your Password is weak";
	}

    };


     // Terms and conditions modal
  $ionicModal.fromTemplateUrl('templates/modal/terms.html', {
    scope: $scope
  }).then(function (modal) {
    $scope.termsModal = modal;
  });
  $scope.closeTermsModal = function () {
    $scope.termsModal.hide();
  };

  $scope.openTermsModal = function () {
    console.log('clicked');
    $scope.termsModal.show();
  };




  })


/*----------------------------------------------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------LOGIN CONTROLLER START---------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------*/
  .controller('LoginCtrl', function ($scope, $rootScope, $stateParams, $dataService, $ionicModal, $ionicLoading, StorageService, $state, $pinroUiService, AuthService) {


//------------------------------------------------------------- LOGIN FUNCTION START -------------------------------------------------------------
      
    	$scope.user = {};    		// declare user object  
    	$scope.disableSubmit = false; 	// to disable and enable button on submit
    	$scope.login = function () {    	
      		$scope.disableSubmit = true;
    		$pinroUiService.showLoading();
      		$dataService.$login($scope.user).then(function (res) {
        		if (res.data.response_data) {				
				AuthService.storeUserCredentials(res.data.response_data);
          			$state.go('app.editorial');		
        		} 
			else {
          			$scope.loginError = 'Invalid username or password';
        		}
       			$scope.disableSubmit = false;
       			$pinroUiService.hideLoading();
     		}, function (err) {
        		$scope.loginError = 'Invalid username or password';
        		$scope.disableSubmit = false;       
        		$pinroUiService.hideLoading();
      		})
    	};
// -------------------------------------------------------------LOGIN FUNCTION END----------------------------------------------------------------




 	$scope.$on('$stateChangeSuccess', function() {
		$scope.loginError="";
		//AuthService.loadUserCredentials();
  	});
//reset password request function (fortgot password)----------------------------------------------------------------------------------------------
    $scope.resetPassword = function (user) {
        $scope.disableSubmit = true;
      	$pinroUiService.showLoading();
      	var params = {
        	
        	email: user.user_login
      	};
      	$dataService.$passwordReset(params).then(function (res) {
        	
          alert('response :'+JSON.stringify(res));

        	if (res.data.response.status === 1) 
          {
          		$scope.resetError = '';
          		$scope.resetSuccess = res.data.msg;
        	} else 
          {
          		$scope.resetSuccess = '';
          		$scope.resetError = res.data.error;
        	}
          
             
       		$scope.disableSubmit = false;
       		$pinroUiService.hideLoading();
      }, function (err) {
        	console.log(err)
        	$scope.resetSuccess = '';
        	$scope.resetError = 'Email or username not found';
	       	$pinroUiService.hideLoading();
        	$scope.disableSubmit = false;
      })
    };
// reset password function end ---------------------------------------------------------------------------------------------------------

    // Terms and conditions modal
  	$ionicModal.fromTemplateUrl('templates/modal/terms.html', {
    		scope: $scope
  	}).then(function (modal) {
    		$scope.termsModal = modal;
  	});
  	$scope.closeTermsModal = function () {
    		$scope.termsModal.hide();
  	};
  	$scope.openTermsModal = function () {
    		$scope.termsModal.show();
  	};
})

/*----------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------MAIN CONTROLLER START (HOME CONTROLLER)---------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------*/
  .controller('MainCtrl', function ($scope,$http,$ionicLoading,$localStorage, $rootScope, $ionicPopup, $interval, $state, $ionicHistory, $ionicScrollDelegate,$ionicPlatform, Maestro, $dataService,$ionicModal,$pinroUiService,$ionicNavBarDelegate, AuthService) {
	$scope.Categories=[];

	

 	$scope.$on('$stateChangeSuccess', function() {
		$scope.user.id= AuthService.id();
        	$scope.user.email= AuthService.email();
        	$scope.user.name=AuthService.name();
        	$scope.user.isLogin= AuthService.isAuthenticated();
  	});


/*********************************************************get Packages**********************************************************************/
	Maestro.$getPackages().then(function(res){

		$scope.packages=res.data.response_data;
        		//alert(JSON.stringify($scope.packages));
	});
/**********************************************************************************************************************************************/

/*********************************************************get Categoriess**********************************************************************/
	Maestro.$getCategories().then(function(res){
		$scope.categoriess=res.data.response_data;
		//alert(JSON.stringify($scope.categoriess));
	});
/**********************************************************************************************************************************************/
      $scope.openPackage= function(id){
		//alert(id);
		$state.go('app.package',{id:id});
	}

	$scope.openCategory= function(id){
		//alert(id);
		$state.go('app.category',{id:id});
	}



$scope.$on("$ionicView.enter", function (event, data) {
//open cart modal
	$scope.openFilterModal = function () {
       		$scope.filterModal.show();
	}
  	$scope.$on('$destroy', function() {
    	$scope.filterModal.remove();
	});
	if($localStorage.zipcode==undefined){
			// $scope.openFilterModal();	
	}
});
   // $state.go('app.zipcode');


 $scope.$on("$ionicView.beforeEnter", function (event, data) {
		
   	$ionicModal.fromTemplateUrl('templates/modal/zip-check.html', {
    		id: 'filter',
    		scope: $scope
  	}).then(function (modal) {
		$scope.zipcheck="";
    		$scope.filterModal = modal;
  	});
  	$scope.closeFilterModal = function () {
    		$scope.filterModal.hide();       
  	};

})
	//$pinroUiService.hideLoading();






/*******/




$scope.checkZipCode= function(data){
		$scope.zipcheck=data;
		$scope.zipa={};
		if($scope.zipcheck==undefined || $scope.zipcheck== null || $scope.zipcheck==""){
			 $ionicPopup.alert({
     					title: 'Please Enter Valid Pin Code',
     					template: 'This service is currently not available in your location',
    					 buttons: [
       						{ text: '<b>CLOSE</<b>',
      							type: 'button-small button-positive' }
     						]
   					});

		}	
		else{
				$scope.zipa.zip=$scope.zipcheck;

				$dataService.$checkZip($scope.zipa).then(function (res) {
					if(res.data.response.status==1){
						$localStorage.zipcode=$scope.zipcheck;
        					$scope.closeFilterModal();
					}
					else if(res.data.response.status==0){
						$ionicPopup.alert({
     							title: 'Service not available',
     							template: 'This service is currently not available in your location',
    					 		buttons: [
       								{ text: '<b>CLOSE</<b>',
      									type: 'button-small button-positive' }
     							]
   						});
					}
      				}, function (err) {
					alert('err'+JSON.stringify(err));
        				console.log(err)
      				})
		}
	}





/******/



    $scope.rateUs=function(){
		var customLocale = {};
		customLocale.title = "Rate us on play store";
		customLocale.message = "Enjoying the MINBazaar experience! We would be glad if you share your experience with others. Thanks for your support!";
		customLocale.cancelButtonLabel = "";

		customLocale.laterButtonLabel = "";
		customLocale.rateButtonLabel = "Rate It Now";
		AppRate.preferences.openStoreInApp = true;
		AppRate.preferences.storeAppURL.android = 'market://details?id=com.minbazaar.app';
		AppRate.preferences.customLocale = customLocale;
		AppRate.preferences.displayAppName = 'MINbazaar';
		AppRate.preferences.usesUntilPrompt = 5;
		AppRate.preferences.promptAgainForEachNewVersion = false;
		AppRate.promptForRating(true);
	}



	
	






   




   

  









  })

/******************************************************************************************************************************************/
  .controller('packageCtrl', function ($scope,$http, $stateParams, $ionicLoading,$localStorage, $rootScope, $ionicPopup, $interval, $state, $ionicHistory, $ionicScrollDelegate,$ionicPlatform, Maestro, $dataService,$ionicModal,$pinroUiService,$ionicNavBarDelegate) {
	Maestro.$getPackageProducts($stateParams.id).then(function(res){
		$scope.packages=res.data.response_data;
		//alert(JSON.stringify($scope.packages));
	});
	//alert('package id : '+$stateParams.id);
	



})



  .controller('nextDaySelectionCtrl', function ($scope,$http, $stateParams, $ionicLoading,$localStorage, $rootScope, $ionicPopup, $interval, $state, $ionicHistory, $ionicScrollDelegate,$ionicPlatform, Maestro, $dataService,$ionicModal,$pinroUiService,$ionicNavBarDelegate, AuthService) {
	//alert('hl');	
	var data1=
  {
		"cust_id":AuthService.id(),
		"package_id":$stateParams.package_id,
		"size_id":$stateParams.package_size_id
	}
	$scope.data=
  {
		"cust_id":AuthService.id(),
		"subscription_id":$stateParams.subscription_id
	}

	//$scope.selectedproducts=[];
	$pinroUiService.showLoading();
	Maestro.$getNextMenu(data1).then(function(res){
		$scope.nextMenu=res.data.response_data;
		$scope.selectedproducts=[];
 //   alert('response :'+JSON.stringify(res));
	 //alert('nextmenu :'+JSON.stringify($scope.nextMenu));
  	for(var i=0;i<$scope.nextMenu.product_data.length;i++)
    {
		       var s={};
			//s.quantity=0;
			s.unit=$scope.nextMenu.product_data[i].unit_data[0];
			s.id=$scope.nextMenu.product_data[i].id;
			s.quantity=0;
			$scope.selectedproducts.push(s);
		}
		  $pinroUiService.hideLoading();
	});


	$scope.check=function(){
    $scope.next_day_selection_data=
    {
        cust_id: $scope.data.cust_id
    };

    $scope.next_day_selection_data.product_data=[];

      angular.forEach($scope.selectedproducts, function(value, key) 
      {

        if(value.quantity>0)
        {

            var extraData=
            {
              product_id: value.id,
              quantity: value.quantity,
              subscription_id: $scope.data.subscription_id,
              unit_id: value.unit.unit_id,
              basic_weight: value.unit.basic_weight,
              total_weight: value.unit.basic_weight*value.quantity*value.unit.weight
            };


            $scope.next_day_selection_data.product_data.push(extraData);


        }
        

          

      });

//          alert('req :'+JSON.stringify($scope.next_day_selection_data));
          $pinroUiService.showLoading();
          $scope.next_day_selection_data.product_data=JSON.stringify($scope.next_day_selection_data.product_data);
          
          Maestro.$post_next_day_selection($scope.next_day_selection_data).then(function(res)
          {
            // alert('response :'+JSON.stringify(res));
              if(res.data.response.status==1)
              {

                alert('mission successfull');
              }

            $pinroUiService.hideLoading();
        });

	}

	$scope.aQuantity = function(item){
  	item.quantity++;
	}
	$scope.dQuantity = function(item){
    if(item.quantity>0)
		item.quantity--;
	}
	
	



})
/**********************************************************************************************************************************
********************************************************* Products by category id *************************************************
**********************************************************************************************************************************/
  .controller('categoryCtrl', function ($scope,$http,$stateParams,$ionicLoading,$localStorage, $rootScope, $ionicPopup, $interval, $state, $ionicHistory, $ionicScrollDelegate,$ionicPlatform, Maestro, $dataService,$ionicModal,$pinroUiService,$ionicNavBarDelegate, CartService) {
	
$pinroUiService.showLoading();
Maestro.$getCategoryProducts($stateParams.id).then(function(res){
	$scope.selectedSize={};
	$scope.products=res.data.response_data;
	alert(JSON.stringify($scope.products));
	$pinroUiService.hideLoading();
});

$scope.subscribeProducts=function(id,unit_id,unit,weight){
	alert(unit_id);
	$state.go('app.step_1',{id:id,unit:unit,unit_id:unit_id,weight:weight,is_subs:true,is_package:false});
}

$scope.addToCart = function (selected,id,price,unit,weight) {
	alert(id);
	var selectedProduct={};
	selectedProduct.unit_mapping_id=id;
	selectedProduct.price=price;
	selectedProduct.unit=unit;
	selectedProduct.weight=weight;
	selectedProduct.productId=selected.id;
	selectedProduct.productName=selected.product_name;
	selectedProduct.productImage=selected.image;
	selectedProduct.quantity=1;
	var isAvailable=false;
	for(var i=0; i<$localStorage.cart.length; i++){
	if(($localStorage.cart[i].productId==selectedProduct.productId)&&($localStorage.cart[i].unit_mapping_id==selectedProduct.unit_mapping_id))
		{	isAvailable=true;
			$localStorage.cart[i].quantity= parseInt($localStorage.cart[i].quantity) + 1; 
		}
			
	}			
	 if(isAvailable==false){
		CartService.push(selectedProduct);
		$rootScope.cartlength++;
	}
	else{
		
	}
		addToCartAnimation();
	
		
}

})

/**********************************************************************************************************************************
************************************************
************************************************************************************************************************************/
.controller('step_1Controller', function ($scope,$http,$stateParams,$ionicLoading,$localStorage, $rootScope, $ionicPopup, $interval, $state, $ionicHistory, $ionicScrollDelegate,$ionicPlatform,ionicTimePicker, Maestro, $dataService,$ionicModal,$pinroUiService,$ionicNavBarDelegate, CartService, AuthService) 
{
  $scope.is_subs=$stateParams.is_subs;
  $scope.is_package=$stateParams.is_package;


	$scope.changeSubscriptionType= function()
	{
			

				
 		if($scope.selectSubscriptionType.answer=="2"){
			$scope.datepickerObject.header="Select Starting Date";
			$scope.datepickerObject.selectType='SINGLE';
			$scope.datepickerObject.closeOnSelect=true;
			$scope.showNextButton=true;
			$scope.subobject.custom_date=0;
		}
		else if($scope.selectSubscriptionType.answer=="1"){
			$scope.datepickerObject.header="Please Select Your Dates";
			$scope.datepickerObject.selectType='MULTI';
			$scope.datepickerObject.closeOnSelect=false;
			$scope.showNextButton=true;
			$scope.subobject.custom_date=1;
		}
		else if($scope.is_subs=='false')
		{
			$scope.datepickerObject.header="Please Starting Date";
			$scope.datepickerObject.selectType='SINGLE';
			$scope.datepickerObject.closeOnSelect=false;
			$scope.showNextButton=true;
			$scope.subobject.custom_date=1;


		}
	}


	if($scope.is_subs==='false')
	{	
		$scope.changeSubscriptionType();
	}

	//alert('mizan 007  : '+JSON.stringify());

	$scope.selectSubscriptionType={};
	$scope.subobject={
		cust_id: AuthService.id(),
		product_id:$stateParams.id,
		unit_mapping_id:$stateParams.unit_id
	};
	
	var weekDaysList = ["Su","Mo", "Tu", "We", "Th", "Fr", "Sa"];
	var monthList = ["Jan", "Feb", "Mar", "Аpr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	disabledDates = [];
      	$scope.selectedDates=[];
	$scope.showNextButton=false;
	$scope.datepickerObject = {
      		templateType: 'POPUP', // POPUP | MODAL
      		modalFooterClass: 'bar-light',
      		header: 'header',
      		headerClass: 'bg-timejesa light',
     		btnsIsNative: false,
      		btnOk: 'OK',
      		btnOkClass: 'button-positive',
      		btnCancel: 'Close',
      		btnCancelClass: 'button-clear button-dark',
      		btnTodayShow: false,
      		btnToday: 'Today',
      		btnTodayClass: 'button-dark',
      		btnClearShow: true,
      		btnClear: 'Clear',
      		btnClearClass: 'button-dark',
      		selectType: $scope.selectType, // SINGLE | PERIOD | MULTI
      		tglSelectByWeekShow: false, // true | false (default)
      		tglSelectByWeek: 'By week',
      		isSelectByWeek: true, // true (default) | false
      		selectByWeekMode: 'INVERSION', // INVERSION (default), NORMAL
      		tglSelectByWeekClass: 'toggle-positive',
      		titleSelectByWeekClass: 'positive positive-border',
		accessType: 'WRITE', // READ | WRITE
      		//showErrors: true, // true (default), false
      		errorLanguage: 'EN', // EN | RU
      		//fromDate: new Date(2015, 9),
      		//toDate: new Date(2018, 1),
		selectedDates: $scope.selectedDates,
      		//viewMonth: $scope.selectedDates, //
      		disabledDates: disabledDates,
		conflictSelectedDisabled: 'DISABLED', // SELECTED | DISABLED
		closeOnSelect: $scope.closeOnSelect,
		mondayFirst: false,
		weekDaysList: weekDaysList,
		monthList: monthList,
      		callback: function (dates) {  //Mandatory
			if(dates!=''){
          
          $scope.new_dates=retSelectedDates(dates);
			    
          $scope.openTimePicker($scope.new_dates);

			   $scope.showNextButton=false;
			}
      		}
    	};
	


/***************************************************************************************************** ADDRESS ******************************/
/*get customer address*/
	$pinroUiService.showLoading();
	Maestro.$getCustomerAddresses(AuthService.id()).then(function(res){

    $scope.Addresses=res.data.response_data;
    $pinroUiService.hideLoading();
		//angular.element('#multidateopen').triggerHandler('click');
	});
/*get add end */

/* select address  */
	$scope.select_address=function(id){

		$scope.showPopup(id);
	}
/*select address */



/*post address */
  $scope.check_zip_avail = function(){
			 
        $scope.new_address={};
        var myPopup = $ionicPopup.show(
        {
        	template: '<label>zip:<input type="text" ng-model="new_address.zip" required></label>',
        	title: 'Enter zip code',
        	subTitle: '',
        	scope: $scope,
        	buttons: [
            		  { text: 'Cancel' },
              		  {
               			 text: '<b>Submit</b>',
                		 type: 'button-dark',
              		   onTap: function(e) {

                  
                  		if (!$scope.new_address.zip)
                  			{
                          		e.preventDefault();
                  			} 
                  		else 
                  			{
                        return $scope.new_address;
                		    }
                }
        }           
          ]
      });
    myPopup.then(function(res) 
    {
      $scope.zipa={};
      $scope.zipa.zip=res.zip;


      $pinroUiService.showLoading();
      $dataService.$checkZip($scope.zipa).then(function (res) 
      {

        if(res.data.response.status==1)
        {
        addAddress(res.data.response_data[0].postal_code);
	      $pinroUiService.hideLoading();

        }
        else 
        {
          alert('sorry! our service is not available ');
      		$pinroUiService.hideLoading();
        }

      }, function (err) 
      { 
        $pinroUiService.hideLoading();
        console.log(err);
      
      });


      

            
    });

      
			
	}
/*post address end*/
/***************************************************************************************************** ADDRESS END *********************/

var addAddress=function(selected_zip)
{

  $scope.new_address={
    'zip':selected_zip
  }

  var myPopup = $ionicPopup.show({
        template: '<label>Address:<input type="text" ng-model="new_address.address" required></label><label>Street:<input type="text" ng-model="new_address.apartment" required></label><label>Contact no:<input type="text" ng-model="new_address.mobno" required></label>',
        title: 'Enter Address',
        subTitle: '',
        scope: $scope,
        buttons: [
              { text: 'Cancel' },
              {
                text: '<b>Submit</b>',
                type: 'button-dark',
                onTap: function(e) {

                  
                  if ((!$scope.new_address.address)||(!$scope.new_address.apartment)||(!$scope.new_address.mobno))
                  {
                          e.preventDefault();
                  } 
                    else 
                  { 
                        return $scope.new_address;
                  }
                }
        }           
          ]
      });

    myPopup.then(function(res) 
    { 
       

       
        $scope.new_address.user_id = AuthService.id();
       /* $scope.new_address.address = res.address;
        $scope.new_address.apartment = res.street;
        $scope.new_address.mobno = res.mobno;
*/
      


      $pinroUiService.showLoading();


        Maestro.$postAddresses($scope.new_address).then(function(res){
        
//        
        if(res.data.response.status==1)
        {
  //      
          Maestro.$getCustomerAddresses(AuthService.id()).then(function(res){
          $scope.Addresses=res.data.response_data;
          });
          $pinroUiService.hideLoading();


        }
      }, function (err) 
      { 
        console.log(err);
	$pinroUiService.hideLoading();
      });


      

            
    });
        
          
}




/****************************************/
var retSelectedDates = function (dates) {
      		//$scope.selectedDates.length = 0;
         

      		for (var i = 0; i < dates.length; i++) {
		     	var ddd=angular.copy(dates[i]);

        		$scope.selectedDates.push(ddd.getFullYear()+'-'+ddd.getMonth()+'-'+ddd.getDate());
      		}

          return $scope.selectedDates;
         

    	};
/***************************************/




/********************popup for quantity**************/
$scope.showPopup = function(selected_address_id) {
  	$scope.data = {};
  //	
  // An elaborate, custom popup

  	var myPopup = $ionicPopup.show({
    		template: '<div class="qtyleft"></div><input class="qtycenter" type="text" ng-model="data.pin"> <div class="qtyright"></div>',
    		title: 'Select Quantity',
    		subTitle: '',
    		scope: $scope,
    		buttons: [
      				{ text: 'Cancel' },
      				{
        				text: '<b>Submit</b>',
        				type: 'button-dark',
        				onTap: function(e) {
         					if (!$scope.data.pin) 
                  {
            							e.preventDefault();
          				} 
                  else 
                  {
            						return $scope.data.pin;
          				}
        				}
				}      			
    			]
  		});


 		myPopup.then(function(res) {
			if(isNaN(res)==false){
				$scope.subobject.quantity=res;
        $scope.subobject.delivery_add_id=selected_address_id;
	}
			
  		});

 	};

/************************************popup quantity end************************************************/









/*******************************open time picker************************************/
$scope.openTimePicker=function(dates){
	

//shivam gupta 12345
	var ipObj1 = {
    		callback: function (val) 
        {  


			      var time="";    //Mandatory
      			if (typeof (val) === 'undefined') {
        			console.log('Time not selected');
              event.preventDefault();

      			} 
            else 
            {

            var selectedTime = new Date(val * 1000);
        			if(selectedTime.getUTCHours()<10)
					    time=time+'0';
				      time=time+selectedTime.getUTCHours()+':';
				   if(selectedTime.getUTCMinutes()<10)
				     	time=time+'0';
				       time=time+selectedTime.getUTCMinutes();
				       $scope.subobject.time_slot=time;
					if($scope.subobject.custom_date==0)
				       		$scope.subobject.start_date=dates[0];
					else
						$scope.subobject.start_date=JSON.stringify(dates);
                $scope.subobject.payment_type='postpaid';
                $scope.subobject.payment_status='Successfull';
                $scope.subobject.payment_mode='online';
                $scope.subobject.current_status=1;
                $scope.subobject.final_price='';




        if($scope.subobject)
        {
           var confirmPopup = $ionicPopup.confirm(
           {
             title: 'Confirmation',
             template: 'Confirm Us by pressing yes button?'
           });
             confirmPopup.then(function(res) 
             {
             	if(res) 
            	 {
              		$pinroUiService.showLoading();
             		 Maestro.$add_new_subscription($scope.subobject).then(function(res)
              		{ 
		                $pinroUiService.hideLoading();
        		        alert('response :'+JSON.stringify(res));
               				
               				if(res.data.response.status==1)
                				{
                					//subscription saved successfully
	         								$state.go('app.confirmation');                					
                  
            				    }
            				

	                }, function (err) 
                {

                });


             } 
             else 
             {

                
             }
           });
         


        }




    	}
    		},
    		inputTime: 68400,   //Optional
    		format: 12,         //Optional
    		step: 5,           //Optional
    		setLabel: 'Set'    //Optional
  	};
	
	
 	ionicTimePicker.openTimePicker(ipObj1);

}

/******************************* open time picker end **********************************/

})

  .controller('confirmationCtrl', function ($scope,$http,$stateParams,$ionicLoading,$localStorage, $rootScope, $ionicPopup, $interval, $state, $ionicHistory, $ionicScrollDelegate,$ionicPlatform,ionicTimePicker, Maestro, $dataService,$ionicModal,$pinroUiService,$ionicNavBarDelegate, CartService, AuthService) 
  {
  
  	alert('confirmationCtrl');
  	

  })




/**********************************************************************************************************************************
********************************************************* Products by category id *************************************************
**********************************************************************************************************************************/
  .controller('subscriptionsCtrl', function ($scope,$http,$stateParams,$ionicLoading,$localStorage, $rootScope, $ionicPopup, $interval, $state, $ionicHistory, $ionicScrollDelegate,$ionicPlatform,ionicTimePicker, Maestro, $dataService,$ionicModal,$pinroUiService,$ionicNavBarDelegate, CartService, AuthService) {


//$scope.subscriptions
  Maestro.$getCustomerSubscriptions(AuthService.id()).then(function(res)
  {
      $scope.subscriptions=res.data.response_data;
      alert('initially :'+JSON.stringify($scope.subscriptions[0].current_status));
  });
  $scope.openSingleSub=function(p_id, s_id, u_m_id)
	{	
  		$state.go('app.singlesubscription',{product_id:p_id,subscription_id:s_id,unit_mapping_id:u_m_id});
	}
   $scope.change_subscription_status=function(cust_id, subscription_id, current_status)
  {   

      if(!e) 
      var e = window.event;
      e.cancelBubble = true;
      if(e.stopPropagation) 
          e.stopPropagation();
        

    //alert('he');
    if(current_status==='1')
    {
      var p='restart';

    }
    else if(current_status==='0')
    {
      var p='pause';
    }

      $scope.data=
      {
         cust_id : cust_id,
         subs_id : subscription_id
      }

      $pinroUiService.showLoading();
      Maestro.$pause_my_subscription($scope.data, p).then(function(res){

          alert('shivam'+JSON.stringify(res));
            if(res.data.response.status==1)
            {
                alert('repo :'+$scope.subscriptions[0].current_status);
                Maestro.$getCustomerSubscriptions(AuthService.id()).then(function(res)
                {
                   $scope.subscriptions=res.data.response_data;
                    alert('again repo :'+$scope.subscriptions[0].current_status);
           //         $state.go($state.current, {}, {reload: true});

                });

                $pinroUiService.hideLoading();

            }
      });
  }
})

/**********************************************************************************************************************************
********************************************************* single subscription *************************************************
**********************************************************************************************************************************/
  .controller('singleSubscriptionCtrl', function ($scope,$http,$stateParams,$ionicLoading,$localStorage, $rootScope, $ionicPopup, $interval, $state, $ionicHistory, $ionicScrollDelegate,$ionicPlatform,ionicTimePicker, Maestro, $dataService,$ionicModal,$pinroUiService,$ionicNavBarDelegate, CartService, AuthService) 
  {
	 




		var data1={};
		data1.cust_id=AuthService.id();;
		data1.product_id=$stateParams.product_id;
		data1.sub_id=$stateParams.subscription_id;
		data1.unit_mapping_id=$stateParams.unit_mapping_id;		
		//alert('data1 : '+JSON.stringify(data1));
		$pinroUiService.showLoading();
		
		Maestro.$getSingleSub(data1).then(function(res){
		  	$scope.singleSubscriptions=res.data.response_data;
			$pinroUiService.hideLoading();
		});
	

	$scope.addExtra=function(id)
  {
		
    //shivam gupta
      $scope.data={};

      var myPopup = $ionicPopup.show({
        template: '<input type="text" ng-model="data.extra_qty">',
        title: 'add Extra Quantity',
       // subTitle: 'Currently available in select cities',
        scope: $scope,
        buttons: [
              { text: 'Cancel' },
              {
                text: '<b>Submit</b>',
                type: 'button-dark',
                onTap: function(e) 
                {
  //                alert('data :'+$scope.data.extra_qty)
                  if (!$scope.data.extra_qty) 
                  {
                          e.preventDefault();
                  }
                  else 
                  { 
//                        alert('else');
                        return $scope.data.extra_qty;
                  }
                }
              }           
          ]
    });

    myPopup.then(function(res) 
    {
        $scope.data.id=id;
        $scope.data.cust_id=AuthService.id();
        $pinroUiService.showLoading();
        Maestro.$addExtraQty($scope.data).then(function(res)
        {
          if(res.data.response.status==1)
          {
            Maestro.$getSingleSub(data1).then(function(res)
            {
                if(res.data.response.status==1)
                { 
                    $scope.singleSubscriptions=res.data.response_data;
                    $pinroUiService.hideLoading();
                    $state.go($state.current, {}, {reload: true});
                }
            });
          }
        });
    });
	}

 
	
})



/********************************************************************************************************************************************
*******************************************************Cart list controller *****************************************************************
*********************************************************************************************************************************************/
.controller('CartCtrl', function ($scope, $ionicScrollDelegate, $ionicPopup, $rootScope, $state, $stateParams, $timeout, Maestro, CartService, StorageService, $pinroUiService,AuthService) {
  
  $scope.CartItemList = [];
	$scope.COD=false;
 	$scope.charges=50;
	$scope.cartLength=CartService.getAll().length;
	$scope.couponObj={};
	var getCartItems = function(){
    		console.log('cart');
    		if(CartService.getAll().length){
        		$scope.CartItemList = CartService.getAll();
        		addToCartAnimation();
      		}
  	}
  	$scope.$on('modal.shown', function(event, data) {
  		console.log('Modal is shown!'+ data.id);
  		if(data.id === 'cart'){
			$ionicScrollDelegate.scrollTop();		
    			getCartItems(); //populate CartItemList from CartService
  		}
	});
	$scope.aQuantity = function(item){
		item.quantity++;
		$rootScope.cartlength++;
	}
	$scope.dQuantity = function(item){
		item.quantity--;
		$rootScope.cartlength--;
	}

	//Animation function for Add to Cart
   	var cart = angular.element(document.getElementsByClassName("shopping-cart"));
  	var addToCartAnimation = function () {
    		cart.css({
      			'opacity': '1',
      			'animation': 'bounceIn 0.5s linear'
    		});
    		$timeout(function () {
      			cart.css({
        		'animation': ''
      			});
    		}, 500)
  	}
	$scope.goToCheckout = function(choice){ 
		
  		if(AuthService.id())
  		{
    			$state.go('app.step_1',{is_subs:false},{reload:true});
  		}else{
				localStorage.setItem('reloads',1);

    			$pinroUiService.showConfirm('signin', "Please login to place order");
  		}
  		$scope.closeCartModal();
	}
					
	$scope.removeItem = function(item){   //remove item from cart function
  		var carrt=CartService.getAll();
  		CartService.remove(item);
		$rootScope.cartlength=$rootScope.cartlength-item.quantity;
	}

	$scope.getSubtotal = function () {  // get subtotal 
		var total = total || 0;
		angular.forEach($scope.CartItemList, function (item) {
			total += parseInt(item.price) * item.quantity;
		});
		return total;
	};

	// Calculates the grand total of the invoice
	$scope.calculateGrandTotal = function (value) {
		return $scope.getSubtotal()+$scope.charges;

	};
})
/********************************************************************************************************************************************
*******************************************************Cart list controller end *************************************************************
*********************************************************************************************************************************************/


.controller('OrderCtrl', function ($scope, $ionicPopup, $rootScope, $ionicScrollDelegate, $stateParams, $ionicHistory, $state, StorageService, Maestro, CartService, $pinroUiService, AuthService, State) {
	$scope.states= State;
	$scope.data="";
	$scope.hidecontent=false;
	$scope.couponObj={};
	$scope.y="";
	$scope.codAvailability=0;
	$scope.billingError="";
	$scope.ShippingError="";
	$scope.selectPaymentError="";
	$scope.isLocal=true;
	$scope.thrashhold=0;
	$scope.below_threshhold_shipping=0;
	$scope.below_threshhold_cod=0;
	var cartcont=0;
	var pMethod="";
	var extraCharges=0;
	$scope.disable=false;
	$scope.choice={};
	var shippingCharges=0;
	$scope.express_charges = -1;
	var codCharges=0;
	$scope.errorMsgPin="";
        localStorage.setItem('count','1');
	$scope.user = {};
	$scope.regex = /^[789]\d{9}$/
	$scope.order = {
		"status": "pending",	
		"set_paid": false,
  		"currency": "INR",
 		"line_items": []
	};

	$scope.order.shipping = {};
	$scope.order.billing = {};
	$scope.order.line_items = [];
	$scope.order.shipping_lines = [
    	{
      		"method_id": "flat_rate",
      		"method_title": "Flat Rate",
      		"total": extraCharges
    	}];
	var user = {};
	$scope.editshipping=function(){
		$scope.hidecontent=false;
	}

/*-----------------------------------------------------Next Button-----------------------------------------------------------------------------*/
	//  in this function 
		//check billing and shipping details valid or not
		//get city, state by pincode and also get cod is available or not
 	$scope.next=function(){
			$scope.disable=false;
			$scope.express_charges = -1;
			pMethod="";
			$scope.choice.answer="not";
			//$scope.codAvailability=0;
			$scope.ShippingError="";
			$scope.billingError="";
			if(($scope.order.billing.first_name==undefined)||($scope.order.billing.last_name==undefined)||($scope.order.billing.first_name==null)||($scope.order.billing.last_name==null)||($scope.order.billing.first_name=="")||($scope.order.billing.last_name=="")){
				$scope.billingError="Please enter a valid name";
			}
			else if($scope.order.billing.email==undefined||$scope.order.billing.email==""||$scope.order.billing.email==null){
				$scope.billingError="Please enter a valid email";
			}
			else if($scope.order.billing.phone.length!=10 || isNaN($scope.order.billing.phone)==true){
				$scope.billingError="Please enter a valid mobile number";
			}
			else if(($scope.order.shipping.first_name==undefined)||($scope.order.shipping.last_name==undefined)||($scope.order.shipping.postcode==undefined)||($scope.order.shipping.city==undefined)||($scope.order.shipping.address_1==undefined)||($scope.order.shipping.address_2==undefined)){
				$scope.billingError="";
				$scope.ShippingError="All fields are required";
			}
			else if ($scope.order.shipping.postcode.length!=6 || isNaN($scope.order.shipping.postcode)==true){
					$scope.billingError="";
					$scope.ShippingError="Please enter valid a zip/pin code";
			}
			else{
				$scope.ShippingError="";
				$scope.billingError="";	
				$pinroUiService.showLoading();
				var pinObj={
					auth_key:'ck_bca5ee0c5f916c12896590606abab1c4cee4cc08',
					pin_code:$scope.order.shipping.postcode
				}
				Maestro.$getPincode(pinObj).then(function(res){
					//alert(JSON.stringify(res));
					if(res.data.ErrorMessage){
						$scope.ShippingError=res.data.ErrorMessage;
						$pinroUiService.hideLoading();
	
					}
					else{
						$scope.ShippingError="";
						$scope.order.shipping.state=res.data.result.state;
						$scope.codAvailability=parseInt(res.data.result.cod_availability);
						$scope.threshhold=parseInt(res.data.result.threshhold);
						$scope.below_threshhold_shipping=parseInt(res.data.result.below_threshhold_shipping);
						$scope.below_threshhold_cod=parseInt(res.data.result.below_threshhold_cod);
						shippingCharges=parseInt(res.data.result.shipping_charges);
						$scope.express_charges=res.data.result.express_charges;
						codCharges=parseInt(res.data.result.cod_charges);
						$scope.hidecontent=true;
						$pinroUiService.hideLoading();

					}

					
				},function(err){
					$pinroUiService.hideLoading();
				});
				//$scope.confirmOrder();
			}
			
		
	}
/*------------------------------------------------------------------Next function end--------------------------------------------------------*/



	$scope.expressCharges = function(){
		var element = document.getElementById('expressShipping');
		//alert(element.checked);
	}

/* ---------------------------------------coupon applying function---------------------------------------------------------------------------*/

	
/*----------------------------------------------------------------------coupun apply end ------------------------------------------------------*/





/*--------------------------------------------------change function (will call when we select/change the payment method)-----------------------*/
	$scope.change = function(v){
		pMethod=v;
		$scope.selectPaymentError="";
	}
/*----------------------------------------------------------------change function end -------------------------------------------------------*/





/*---------------------------------------------------------------get user information -------------------------------------------------------*/
	var getUserInfo = function(user_id){
		
   		$pinroUiService.showLoading();			
    		Maestro.$getCustomerById(user_id).then(function(res){
 			$pinroUiService.hideLoading();
			if(res.data.id){
				
    				$scope.user = res.data;
    				$scope.order.shipping = $scope.user.shipping || {};
				$scope.order.billing = $scope.user.billing || {};
				if($scope.order.billing.phone=="")
					$scope.order.billing.phone= AuthService.phone();
			
			}else{
 				// alert("There's been an error");
			};

			if(!$scope.order.shipping.country){
      				$scope.order.shipping.country = "IN";
    			}

  		}, function(err){
    			$pinroUiService.hideLoading();
    			console.log(err);
  		})// maestro.$getCustomerById close
	}// get user info
/*---------------------------------------------------------------get user information end -----------------------------------------------------*/



/* -------------------------------------------------------------------------------------------------------------------------------------------*/
 	$scope.$on("$ionicView.enter", function(event, data){
   		//console.log("State Params: ", data.stateParams);
		$scope.hidecontent=false;
		cartcont=0;
		$scope.couponObj={};
   		var user = JSON.parse(localStorage.getItem('userObj'));//hard code
   		console.log(user);
      		if(user){
			 var user_id = AuthService.id();
			//var user_id = 106;//hard code
      			$scope.order.customer_id = user_id; //assing customer id
      			//console.log($scope.order);
      			getUserInfo(user_id); //get user info
      		}
	 }); // scope on end
/* -------------------------------------------------------------------------------------------------------------------------------------------*/



/*----------------------------------------------------------show popup function----------------------------------------------------------------*/
	// if cart items are not available for given zipcode 
	$scope.showPopup = function(dhoom) {
	var tem=""
        for(i=0;i<dhoom.length;i++)
	     tem=tem+'<h6 style="text-align:left; color:black; border-bottom:1px solid black">'+dhoom[i].name+'</h6>';
  	var doClar = false;
  	var myPopup = $ionicPopup.show({
    		template: tem,
    		title: 'Can\'t proceed further',
    		subTitle: 'These items are not available in your location',
    		scope: $scope,
    		buttons: [
      				{ text: 'Cancel' },
      				{
        				text: '<b>Clear</b>',
        				type: 'button-dark',
        				onTap: function(e) {
						doClar=true;
        				}
				}      			
    			]
  		});
 		myPopup.then(function(res) {
			if(doClar)
			 {
   				var confirmPopup = $ionicPopup.confirm({
     					title: 'Are you sure?',
     					template: 'Do you want to remove all these item(s)?'
   				});
   				confirmPopup.then(function(res) {
     					if(res) {
						$rootScope.cartlength=$rootScope.cartlength;
       						for(k=0;k<dhoom.length;k++){
							$rootScope.cartlength=$rootScope.cartlength-dhoom[k].quantity;
							CartService.remove(dhoom[k]);
						}
     					} else {
      						 	console.log('You are not sure');
     					}
   				});
			}			
  		});

 	};
/*-----------------------------------------------------------------show popup end-------------------------------------------------------------*/








/*----------------------------------------------------------- validation of-------------------------------------------------------------------*/
	$scope.validConfirm = function(){
		var totalAmountOfCart=0;
		var res1=$scope.order.shipping.postcode;
		var cartItemsa = CartService.getAll();
		var itemToRemove =[];
		$scope.order.line_items = [];
		for(i=0;i<cartItemsa.length;i++){
			totalAmountOfCart=totalAmountOfCart+cartItemsa[i].price*cartItemsa[i].quantity;
		}
		var yo=false;
		$scope.disable=false;
		if(res1.length==6 && isNaN(res1)==false){
			check1 = res1.substring(0, 4);
			if(check1!='4520'){
				for(var i=0;i<cartItemsa.length;i++)
				{					
					//totalAmountOfCart=totalAmountOfCart+cartItems[i].price*cartItems[i].quantity;
					for(var cart=0;cart<cartItemsa[i].category.length;cart++)
					{
		       				if(cartItemsa[i].category[cart].id==159){
							yo=true;
		  					itemToRemove.push(cartItemsa[i]);
							break;			
						}
					}			
				}
			}
		}
		if(yo){
			$scope.showPopup(itemToRemove);
			return;
		}
		//angular.each(cacartItems));
		
		if(totalAmountOfCart<=$scope.threshhold){
			shippingCharges=parseInt($scope.below_threshhold_shipping);
			codCharges=parseInt($scope.below_threshhold_cod);
				
		}
		if(($scope.express_charges!=-1)&&$scope.hidecontent){

		if(document.getElementById('expressShipping').checked){
			shippingCharges=parseInt($scope.express_charges);
		}}	
		if(pMethod=='cod'){	
	   		extraCharges=codCharges+shippingCharges;
	       		$scope.order.payment_method='COD';
	   		$scope.order.payment_method_title="Cash on delivery"
		}
		else if(pMethod=='online'){	
			extraCharges=shippingCharges;
			$scope.order.payment_method='Online';
			$scope.order.payment_method_title="Paid online"
		}		
		$scope.order.shipping_lines[0].total=extraCharges;
		if($scope.order.billing.first_name==""||$scope.order.billing.first_name==null||$scope.order.billing.first_name==undefined ||  $scope.order.billing.last_name==""||$scope.order.billing.last_name==null||$scope.order.billing.last_name==undefined){
			$ionicScrollDelegate.scrollTop();
			$scope.billingError="Please enter a valid name";			
		}
		else if($scope.order.billing.email==undefined||$scope.order.billing.email==null||$scope.order.billing.email==""){
			$ionicScrollDelegate.scrollTop();
			$scope.billingError="Please enter a valid email";
		}
		else if($scope.order.billing.phone.length!=10 || isNaN($scope.order.billing.phone)==true){
			$ionicScrollDelegate.scrollTop();
			$scope.billingError="Please enter a valid mobile number";
		}
		else if(($scope.order.shipping.first_name==undefined)||($scope.order.shipping.last_name==undefined)||		($scope.order.shipping.postcode==undefined)||($scope.order.shipping.city==undefined)||($scope.order.shipping.address_1==undefined)||($scope.order.shipping.address_2==undefined)){
			$scope.billingError="";
			$scope.ShippingError="All fields are required";
		}
		else if ($scope.order.shipping.postcode.length!=6 || isNaN($scope.order.shipping.postcode)==true){
			$scope.billingError="";
			$scope.ShippingError="Please enter valid a zip/pin code";
		}
		else if($scope.order.shipping.state==undefined){
			$scope.billingError="";
			$scope.ShippingError="Please select your state";
		}
		else if($scope.choice.answer!='cod' && $scope.choice.answer!='online'){
			$scope.billingError="";
			$scope.selectPaymentError="Please select a payment method";
			
		}
		else{
			$scope.ShippingError="";
			$scope.billingError="";
			$scope.confirmOrder();
		}
	}

/*--------------------------------------------------------------validation end---------------------------------------------------------------*/





/*---------------------------------------------------------------confirm order------------------------------------------------------------------*/
	$scope.confirmOrder = function(){
		$scope.disable=true;
		var cartItems = CartService.getAll();	//get cart items

		angular.forEach(cartItems, function(item){
  			var itemToPush = {
    				product_id: item.product_id,
    				quantity: item.quantity
  			}
  			if(item.variation_id){
    				itemToPush.variation_id = item.variation_id;
  			}
			console.log('Pushing item');
  			console.log(JSON.stringify(itemToPush));
  			$scope.order.line_items.push(itemToPush);
		})
  		$pinroUiService.showLoading();  	 	
		$scope.order.shipping.country="India";
  		//$scope.order.billing = $scope.order.shipping;
		if(user && user.id){
  			$scope.order.customer_id = user.id;
		}
		Maestro.$createOrder($scope.order).then(function(res){
			var shippingid=res.data.shipping_lines[0].id;
  			if(res.data.id){
				var deliveryAdd={
					postcode: res.data.shipping.postcode,
					city: res.data.shipping.city
				}
				window.localStorage.setItem('deliversTo',JSON.stringify(deliveryAdd));
    				CartService.removeAll(); //remove all item in cart
				$rootScope.cartlength=CartService.getAll().length;
    				$state.go('app.payment_step2', {orderId: res.data.id, 
							amount: res.data.total,
							method: pMethod,
							codCharges:codCharges,
							shippingCharges:shippingCharges,  
							currency: res.data.currency, 
							email: res.data.billing.email,
							name: res.data.billing.first_name+" "+res.data.billing.last_name, 
							phone: res.data.billing.phone,
							});
  			}
			else
			{
    							
					 $ionicPopup.alert({
     					title: 'Alert',
     					template: 'Order Couldn\'t be processed',
    					 buttons: [
       						{ text: '<b>CLOSE</<b>',
      							type: 'button-small button-dark' }
     						]
   					});
  			}
			$scope.disable=false;
			$pinroUiService.hideLoading();
		}, function(err){
  			console.log(err);
			$scope.disable=false;
  			$pinroUiService.hideLoading();
			
		})//Maestro.$createOrder
	};
										//go to main screen
 	$scope.goToMain = function () {
    		$ionicHistory.nextViewOptions({
      			disableBack: true
    		});
    		$state.go('app.editorial');
 	}// goToMain
}) // orderCtrl




/*----------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------payment ctrl-------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------*/
.controller('PaymentCtrl', function ($scope, $http, $stateParams, $ionicPopup, $ionicHistory, $state, StorageService, Maestro, CartService,$cordovaNgCardIO, $pinroUiService, $interval) {
	$scope.disable=false;
	$scope.newvariable = "";
	$scope.codCharges=parseInt($stateParams.codCharges);
	$scope.shippingCharges=parseInt($stateParams.shippingCharges);
	if($stateParams.method=="cod")
		$scope.extraCharges=$scope.shippingCharges+$scope.codCharges;
	else
		$scope.extraCharges=$scope.shippingCharges;

	$scope.selected_method=$stateParams.method;
	$scope.amount = parseInt($stateParams.amount);
	$scope.cart_total= $scope.amount- $scope.extraCharges;	

	$scope.methodText="";
	if($scope.methodChosen=='cod')
	   $scope.methodText='Cash On Delivery';
	else
	   $scope.methodText='Online';
	var orderId;
 	$scope.cardType = {};
    	$scope.card = {};
    	var dataForStripe = {};
 	$scope.$on("$ionicView.enter", function(event, data){
	   	$scope.disable=false;
   		orderId = data.stateParams.orderId;

  // pass order and amount details for stripe
  dataForStripe.amount = parseInt(data.stateParams.amount); // amount is in cents/pence for stripe so * 100
      dataForStripe.currency = data.stateParams.currency;
      dataForStripe.name = data.stateParams.name;
      dataForStripe.phone = data.stateParams.phone;
      dataForStripe.description =  "Payment for Maestro Order #"+ orderId;

 });





$scope.payCashOnDelivery = function(){
  
	
  $state.go('app.payment_step3', {orderId: orderId, payByCash: true})
}
$scope.payOnline = function(){
			$scope.disable=true;

//-----------------------------------------------------------------------------------------------------------------------------------------------
		  // added by mizan
			var paymentobj = { "window" : "open",
                                             "payment" : "pending"};
			
			paymentstr= JSON.stringify(paymentobj);
			var bemail= JSON.parse(localStorage.getItem('userObj')).email;
                        var paymentStatus="pending";// creaded  by mizan 
			link = 'https://minbazaar.com/wp_instamojo_gate/payment.php';
			var countp=1;
			$http.post(link, {username : dataForStripe.name,
				amount : $scope.amount,
			        email : $stateParams.email,
				phone : dataForStripe.phone}).then(function (res){
				//window.open(res.data+"?embed=form", '_blank', 'location=no');
			    	var win = window.open(res.data+"?embed=form", '_blank', 'location=no, toolbar=yes, EnableViewPortScale=yes, clearcache=yes');
				win.addEventListener("loadstart", function(){
					navigator.notification.activityStart("Please Wait, ", "Please do not press back or refresh this page....");
				});
				
				win.addEventListener("loadstop", function() {
					navigator.notification.activityStop();
					win.executeScript({code: "localStorage.setItem('paymentobj','paymentstr');"});
					var loop = $interval(function(){
						win.executeScript({code: "localStorage.getItem('paymentobj');"},
                            			function(values){
                                			var name = values[0];
							
							paymentobj= JSON.parse(name);	
							if((paymentobj.window)==='closed'){
								if(countp==1){
									 countp=0;
									$scope.newvariable = name;
									localStorage.setItem('jobject',name);
								        
								}
								win.executeScript({code: "localStorage.removeItem('paymentobj');"});
							    	win.close();
								$interval.cancel(loop);		 
                                			}
                            			});
                       			 },1000);                            	
				});				
				win.addEventListener('exit', function() {
					var jobjects = localStorage.getItem('jobject');
					
					if((jobjects!=null)&&(jobjects!="null")){
						var jobjectp= JSON.parse(jobjects);
						if(jobjectp.payment==="fail")
						{	
							localStorage.removeItem('jobject');
							$state.go('app.payment_step3', {orderId: orderId, transactionId: jobjectp.payment_id, status: 'failed'});
							
						}
						else if(jobjectp.payment==="done"){
							localStorage.removeItem('jobject');
							$state.go('app.payment_step3', {orderId: orderId, transactionId: jobjectp.payment_id, status:'done'});
						}
						else{
							//alert('yaha kabhi alert nahi aana chahiye');
						}
					}
					else
					{
						$state.go('app.payment_step3', {orderId: orderId, status: 'cancel'});
						
						
					}
									
					
				})// exit event listner
        		});// post method
			
// if payment done
//-----------------------------------------------------------------------------------------------------------------------------------------------

}
 	$scope.goToMain = function () {
    		$ionicHistory.nextViewOptions({
      			disableBack: true
    		});
    		$state.go('app.editorial', {}, { reload: true });
 	}
$scope.scanCard = function(){
    $cordovaNgCardIO.scanCard()
        .then(function (response) {
                //Success response - it's an object with card data
                console.log(response);
                $scope.card.number = response.card_number;
                $scope.card.exp_month = response.expiry_month;
                $scope.card.exp_year = response.short_expiry_year;
                $scope.card.cvc = response.cvv;


              },
              function (response) {
                //We will go there only when user cancel a scanning.
                //response always null
                console.log(response);
              }
        );
}


})

.controller('OrderConfirmCtrl', function ($scope, $rootScope, $stateParams, $ionicHistory, $state, $ionicPopup, StorageService, Maestro, CartService, $pinroUiService) {
	var order = {};
	
	$scope.statusp=$stateParams.status;
	$scope.tid=$stateParams.transactionId;


	$scope.orderStatus= 'Order accepted';
	if($stateParams.status=='cancel'){
	    	$scope.orderStatus='Payment Cancelled by you'
	}
	else if($stateParams.status=='failed'){		
		$scope.orderStatus='Payment Failed'
	}
	else if($stateParams.status=='done'){
		$scope.orderStatus='Payment Success'
	}


	var updateOrder = function(data){
  		$pinroUiService.showLoading();
  		//$scope.loading = true;
  		Maestro.$updateOrder(data).then(function(res){

    			console.log(res)
   			// $scope.loading = false;
   			$pinroUiService.hideLoading();
  		}, function(err){
   	 		console.log(err);
    			//$scope.loading = false;
    			$pinroUiService.hideLoading();
  		})
	}
	$scope.$on("$ionicView.enter", function(event, data){    // handle event
		//$pinroUiService.showLoading();
		console.log("State Params: ", data.stateParams);
    		if(data.stateParams.payByCash){
			
        		order = {
              			id: data.stateParams.orderId,
              			status: 'processing'
	
          		}
      		}
		else{
			if(data.stateParams.status=='done'){
        			order = {
            					id: data.stateParams.orderId,
            					transaction_id: data.stateParams.transactionId,
            					set_paid: true,
            					status: 'processing'
			
        				}
			}
			else{
				order=	{
						id: data.stateParams.orderId,
            					transaction_id: data.stateParams.transactionId,
            					set_paid: false,
            					status: 'pending'}
					}
  
   			} 
			updateOrder(order); // update order			
			//$pinroUiService.hideLoading();
			if(localStorage.getItem('count')=='1'){
				localStorage.setItem('count','0');		
							//location.reload();	
			}
 			}); //$on end

//go to main screen
 	$scope.goToMain = function () {
    		$ionicHistory.nextViewOptions({
      			disableBack: true
    		});
	 	$state.transitionTo('app.editorial',null, { reload: true, inherit: false, notify: true });
   // $state.go('app.editorial',{},{inherit:false,reload:true});
  	}
})
.controller('WishlistCtrl', function ($scope, $stateParams, $state, $timeout, Maestro, WishlistService) {
//CartService.getAll();
  $scope.WishListItems = [];


  $scope.editWishlist = false;


//Get CartItemList function
var getWishlistItems = function(){
    if(WishlistService.getAll().length){
        $scope.WishListItems = WishlistService.getAll();
       
      }
  }

  $scope.$on('modal.shown', function(event, data) {
  console.log('Modal is shown!'+ data.id);
  if(data.id === 'wishlist'){

    getWishlistItems(); //populate WishListItems from WishlistService
  }
});

$scope.makeListEditable = function(){
  $scope.editWishlist = true;
}


//remove item from wishlist function
$scope.removeSelectedItems = function(){
  angular.forEach($scope.WishListItems, function(item){
    if(item.selected){
      WishlistService.remove(item);
    }
  });
  $scope.editWishlist = false;
  getWishlistItems(); 
}


//go to product

    $scope.goToProduct = function (id) { //close all open modal and go to product page
      console.log('clicked');
      $scope.wishlistModal.isShown() ? $scope.wishlistModal.hide() : null;
      $state.go('app.single', {
        id: id
      });
    }

})
/* -------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------Search Product controller------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------*/
.controller('SearchCtrl', function ($scope, $timeout,$stateParams, $state, $ionicScrollDelegate, $ionicHistory, $ionicLoading, Maestro, $pinroUiService) {
	$scope.page=1;
	$scope.searchErorr="";
	$scope.isError=false;
	$scope.productList = [];
 	/*$scope.$on('modal.shown', function(event, data) {
  		console.log('Modal is shown!'+ data.id);
  		if(data.id === 'search'){
  		}
	});*/
	
	$scope.goback=function(){
		$ionicHistory.goBack(-1);
	}
	$scope.goToProduct = function (id) { //close open modal and go to product page
      		//$scope.searchModal.isShown() ? $scope.searchModal.hide() : null;

      		$state.go('app.single', {id: id});
    	};
	$scope.searchProducts= function(){
		$scope.page=1;
		if($scope.search1==null || $scope.search1==""|| $scope.search1==undefined){
			$scope.productList="";
			$scope.searchErorr="Please enter some keywords to search";
			$scope.isError=true;
			$scope.more = false;
		}
		else{
			$scope.searchErorr="";
			$scope.isError=false;
			$pinroUiService.showLoading();
   			Maestro.$getAllProducts($scope.search1,$scope.page).then(function(res){
				if(res.data.length>=10)
					$scope.more = true;
    				if(res.data.length){
      					$scope.productList = res.data;
					
    				}else{
						$scope.searchErorr="No Results for :  \""+$scope.search1+"\"";
						$scope.isError=true;
						$scope.productList="";
						$scope.more = false;
				}
				$pinroUiService.hideLoading();		
  			}, function(err){
				$pinroUiService.hideLoading();
  			})
		};
	}
	$scope.loadMoreProducts= function (){
		$scope.page++;
		Maestro.$getAllProducts($scope.search1,$scope.page).then(function(res){
			if(res.data.length>0)
				$scope.productList = $scope.productList.concat(res.data);
			if(res.data.length<10)
				$scope.more=false;
			$scope.$broadcast('scroll.infiniteScrollComplete');	
		}, function(err){		
		})
   	}
})

/*-------------------------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------profile controller--------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------*/
.controller('ProfileCtrl', function ($scope,$rootScope, $stateParams, $ionicHistory, $state, StorageService, $dataService, Maestro, CartService, $pinroUiService, AuthService) 
{
	

  $rootScope.count=1;
	$scope.user = {}; // to assign and display user Data
	$scope.show = 'orders'; 
	$scope.loadOrders = false;
	$scope.showmessage=false;
	$scope.orderList = [];
 	$scope.offerPosts = [];
  
  	$scope.convertfloat=function(vaa){
			return parseFloat(vaa);
	}
	var getUserInfo = function(user_id){
			$pinroUiService.showLoading();
      Maestro.$getCustomerById(user_id).then(function(res){
    				
    				$pinroUiService.hideLoading();
				if(res.data.id){
    					$scope.user = res.data;
    					if($scope.user.first_name && $scope.user.last_name){
      						$scope.full_name = $scope.user.first_name + ' ' + $scope.user.last_name+"hwllo";
    					}
					}else{
  					////alert("There's been an error");
					}
  				}, function(err){
    					console.log(err);
    					$pinroUiService.hideLoading();
  			})
	}


//get all orders by customer
var getOrdersByCustomer = function(userId){
  	
    //alert('userId :'+userId);
    $scope.loadOrders = true;
  	$scope.showmessage=false;
  //  alert('getOrdersByCustomer'+userId);
  	$pinroUiService.showLoading();
  	Maestro.$get_orders(userId).then(function(res){
    
      if (res.data.response_data) 
      {
            if(res.data.response_data.order_details.length>0)
            {
              $scope.items=res.data.response_data.order_details;
              $pinroUiService.hideLoading();
                            
            }
            else 
            {

              $scope.showmessage=true;
              $pinroUiService.hideLoading();

            }
      


      }    
      //$pinroUiService.hideLoading();


        /*if(res.data.length){
      			$scope.orderList = res.data;	
			$scope.loadOrders = false;
	 		$pinroUiService.hideLoading();
			console.log(JSON.stringify(res.data));
    		}
		else{
			$scope.orderList = [];
		}
     		*///$scope.loading = false; 
  	}, function(err){
		$scope.loadOrders = false;
		$scope.showmessage=false;
     		//$scope.loading = false;
     $pinroUiService.hideLoading();
  	})
}


//controller over shivam
// get offer post
 /*   var getOfferPosts = function () {
      $dataService.$getPosts({
        slug: 'offers'
      }).then(function (res) {
        console.log(res);
        if(res.data && res.data.posts.length){
          $scope.offerPosts = res.data.posts; //.thumbnail
        }

      }, function (err) {
        console.log(err);
      })

    }*/



$scope.$on("modal.shown", function(event, data){
  	if(data.id === 'profile'){
    		var user_id = AuthService.id(); 
		//var str = JSON.stringify(user_id, null, 4);	
		//console.log("Valueeeeeeeeeeeeeeeeee" + str);
		// to get userObj from localStorage Service
    		//var user_id = 61;    ///hard code
    	//	getUserInfo(user_id);

    		getOrdersByCustomer(user_id);
   		// getOfferPosts();
  	}
})

})



//Settings controller
.controller('SettingsCtrl', function ($scope, $stateParams, $ionicHistory, $ionicPopup, $state, StorageService, $dataService, Maestro, CartService, $pinroUiService, AuthService, Language, State) {
	$scope.states= State;
	$scope.user = $scope.user || {}; // to assign and display user Data
	$scope.add_new={};


  $pinroUiService.showLoading();
  Maestro.$getCustomerAddresses(AuthService.id()).then(function(res){

    $scope.Addresses=res.data.response_data;
    //alert('repo :'+JSON.stringify($scope.Addresses));
    $pinroUiService.hideLoading();
    //angular.element('#multidateopen').triggerHandler('click');
  });

  var getUserInfo = function(user_id){
   		$scope.loading = true;
    		Maestro.$getCustomerById(user_id).then(function(res){
 			$scope.loading = false;
			if(res.data.id){
    				$scope.user = res.data;	
    				$scope.user.shipping = $scope.user.shipping || {};
    				if(!$scope.user.shipping.country){
      					$scope.user.shipping.country = "IN";
    				}   
			}else{
  				alert('There\'s been an error');
			}
  		}, function(err){
     			$scope.loading = false;
    			console.log(err);
  		})
	}
  $scope.add_address=function()
  {

    $scope.add_new.user_id = AuthService.id();
    $pinroUiService.showLoading();
    
    $scope.check_zip={
      zip: $scope.add_new.zip
    };

    $dataService.$checkZip($scope.check_zip).then(function (res) 
      {
        if(res.data.response.status==1)
        {
          
//           $pinroUiService.hideLoading();
               Maestro.$postAddresses($scope.add_new).then(function(res){

                      if(res.data.response.status==1)
                      {

                          alert('jai ho done ');
                          $pinroUiService.hideLoading();

                      }

                });

        }
        else 
        {
          alert('sorry! our service is not available ');
          $pinroUiService.hideLoading();
        }

      }, function (err) 
      { 
        console.log(err);
      
      });




  }
	$scope.lang = Language.getLang();
    	$scope.setLang = function(x){
       		Language.saveLang(x);
       		$rootScope.Dict = Dict[Language.getLang()];
	}
  $scope.add_new_address=function()
  {
    $scope.add_new_addressModal.show();
  }
	$scope.updateProfile = function(){
		
  		$pinroUiService.showLoading(); 
  		Maestro.$updateCustomer($scope.user).then(function(res){  
    			console.log(res.data);
    			if(res.data.id){
       				$pinroUiService.hideLoading(); 
      				//error pop up dialog
    				$ionicPopup.alert({
     					title: 'Success',
     					template: "Your profile has been updated",
      					buttons: [
       							{ text: '<b>CLOSE</<b>',
      							type: 'button-small button-dark' }
     						]
   				});
   				closeModals();
    			}
  		}, function(err){
    		console.log(err);
$pinroUiService.hideLoading(); 
//error pop up dialog
    $ionicPopup.alert({
     title: 'Error',
     template: "There's been an error. Please log out and try again.",
     buttons: [
       { text: '<b>CLOSE</<b>',
      type: 'button-small button-assertive' }
     ]
   });

  })
}

var closeModals = function(){

      $scope.changePasswordModal.isShown() ? $scope.changePasswordModal.hide() : null;
      $scope.editProfileModal.isShown() ? $scope.editProfileModal.hide() : null;
      $scope.add_new_addressModal.isShown() ? $scope.add_new_addressModal.hide() : null;
}



$scope.$on("modal.shown", function(event, data){

  if(data.id === 'settings'){
    var user_id = AuthService.id(); // to get userObj from localStorage Service
   // var user_id = 61; //hard code
    getUserInfo(user_id);
  }

})

$scope.$on("modal.shown", function(event, data){

  if(data.id === 'edit-profile'){
    //var user_id = StorageService.getUserObj().user_id; // to get userObj from localStorage Service
 
    $scope.user.password = null;
  }

})


})

.controller('zipCtrl', function ($scope, $ionicHistory,  $ionicPopup, $stateParams, $timeout, $dataService, StorageService, Maestro, $state, $ionicModal, $interval, AuthService) {
	$scope.checkZipCode= function(){
		$scope.zipa={};
		if($scope.zipcheck==undefined || $scope.zipcheck== null || $scope.zipcheck==""){
			 $ionicPopup.alert({
     					title: 'Please Enter Valid Pin Code',
     					template: 'This service is currently not available in your location',
    					 buttons: [
       						{ text: '<b>CLOSE</<b>',
      							type: 'button-small button-positive' }
     						]
   					});


		/*
				$ionicPopup.alert({
     					title: 'Service not available',
     					template: 'This service is currently not available in your location',
    					 buttons: [
       						{ text: '<b>CLOSE</<b>',
      							type: 'button-small button-positive' }
     						]
   					});
		*/
		}	
		else{
		 alert($scope.zipcheck);
				$scope.zipa.zip=$scope.zipcheck;

				$dataService.$checkZip($scope.zipa).then(function (res) {
					if(res.data.response.status==1){
        					alert("success"+res.data.response_data[0].postal_code);
					}
					else if(res.data.response.status==0){
						$ionicPopup.alert({
     							title: 'Service not available',
     							template: 'This service is currently not available in your location',
    					 		buttons: [
       								{ text: '<b>CLOSE</<b>',
      									type: 'button-small button-positive' }
     							]
   						});
					}
      				}, function (err) {
					alert('err'+JSON.stringify(err));
        				console.log(err)
      				})
		}
	}

});
