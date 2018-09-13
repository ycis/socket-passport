var myApp = angular.module("myapp", []);
myApp.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
});
myApp.controller("PasswordController", function($scope) {
    var strongRegex = new RegExp("^" +
                            "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"
                        );
    var mediumRegex = new RegExp("^" +
                            "(((?=.*[a-z])(?=.*[A-Z]))|" +
                            "((?=.*[a-z])(?=.*[0-9]))|" +
                            "((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})"
                        );
    $scope.pwStr = {};
    $scope.analyze = function(value) {
            if(strongRegex.test(value)) {
            $scope.pwStr["background-color"] = "green";
            $scope.strength = "Strong";
        } else if(mediumRegex.test(value)) {
            $scope.pwStr["background-color"] = "orange";
            $scope.strength = "Medium";
        } else {
            $scope.pwStr["background-color"] = "red";
            $scope.pwStr["color"] = "white";
            $scope.strength = "Weak";
        }
    };
});

function validEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

$(document).ready(function() { 
  $('.password').on('change keyup paste',function(){
    const $confirm = $('#confirm')[0]
    if(!$confirm) return; 
    $confirm.setCustomValidity(
      $('#password').val()!==$('#confirm').val()?"Passwords Don't Match":''
    );
  })
  $("form").on("submit", function(event) {
      if (this.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }
      this.classList.add('was-validated');
      var emailInput = $('#email');
      apiTestAndSet($('#displayname'), 'displaynames')
      apiTestAndSet(emailInput, 'emails', validEmail(emailInput.val()))
  });
  $('[data-toggle="popover"]').popover();
  $('.popover-dismiss').popover({
      trigger: 'focus'
  });
    
  $('#displayname').on('change keyup paste',function(){
    apiTestAndSet($(this), 'displaynames')
  })

  $('#email',$('#signup')).on('change keyup paste',function(){
      apiTestAndSet(this, 'emails', validEmail($(this).val()))
  })
});


var apiTestAndSet = function(input,apiUrl,preApiPassed) {
  var inputVal = $(input).val();
  var parentDiv = $(input).parent();
  var labelText = $('label',parentDiv).text();
  var feedbackDiv = $('.invalid-feedback',parentDiv)
  const colorArr = ['green','orange','red'];
  const iconArr = ['fa-check','fa-exclamation-triangle','fa-times']; 
  const errMsgArr = ['','Invalid ' + labelText,labelText + ' In Use']


  function estGroupSetting(index) {
      const icon = index < 2;
      var iconHtml  = icon?'':'In Use ';
      iconHtml += `<i class="fas ${iconArr[index]}"></i></i>`
      var styleText = `color:${colorArr[index]};`
      $('.available',parentDiv).remove();
      feedbackDiv.text(errMsgArr[index])
      $(input)[0].setCustomValidity(errMsgArr[index])
      if(!feedbackDiv.is(":visible")){
          var alertDiv = $('<div>')
                  .addClass('available')
                  .attr('style',styleText)
                  .html(iconHtml);
          parentDiv.append(alertDiv)
      }
  }
  estGroupSetting(0);//remove all warnings
  console.log(`/api/${apiUrl}/${inputVal}`)
  if (typeof preApiPassed !== 'undefined') {
      if(!preApiPassed) {
          estGroupSetting(1);
          return
      }
  }

  if (inputVal.length < 5) {
      estGroupSetting(1,'too short ');
      return
  }
  $.get(`/api/${apiUrl}/${inputVal}`, function(data) {
      console.log(data)
      if(data !== null) {
          estGroupSetting(2);
      } 
  });
}