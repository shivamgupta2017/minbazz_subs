$scope.email = 'shivamgupta1430@gmail.com';
    $scope.phone = '9993330227';

    var p = localStorage.getItem('userObj');
//    alert('shivam : '+(p));
    //***********************************
    $scope.disable=true;


      var paymentobj = { 
        "window" : "open", 
        "payment" : "pending"
      };
      
      paymentstr= JSON.stringify(paymentobj);
      var bemail= JSON.parse(localStorage.getItem('userObj')).email;
      var paymentStatus="pending";// creaded  by mizan 
      link = 'https://minbazaar.com/subs/admin/wp_instamojo_gate/payment.php';
      var countp=1;
      $http.post(link, {
        'username' : 'shivam',
        'amount' : '100',
        'email' : $scope.email,
        'phone' : $scope.phone}).then(function (res){

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
          win.addEventListener('exit', function() {
          var jobjects = localStorage.getItem('jobject');
          alert('shivam :'+JSON.stringify(jobjects));

          if((jobjects!=null)&&(jobjects!="null"))
          {
            var jobjectp= JSON.parse(jobjects);
            if(jobjectp.payment==="fail")
            { 
              alert('shivam payment failed :');

              localStorage.removeItem('jobject');
              $state.go('app.payment_step3', {orderId: orderId, transactionId: jobjectp.payment_id, status: 'failed'});
              
            }
            else if(jobjectp.payment==="done")
            {
              alert('shivam payment succeess');
              localStorage.removeItem('jobject');
             // $state.go('app.payment_step3', {orderId: orderId, transactionId: jobjectp.payment_id, status:'done'});
            }
            else{
              //alert('yaha kabhi alert nahi aana chahiye');
            }
          }
          else
          {
            
           //    $state.go('app.payment_step3', {orderId: orderId, status: 'cancel'});
            //   $state.go('app.payment_step3', {orderId: '1', transactionId: '1', status:'done'});
            
            alert('sflkfslf');        
              
          }
                  
          
        })// exit event listner
            });