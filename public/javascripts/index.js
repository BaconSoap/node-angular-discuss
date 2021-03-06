var app = angular.module('discuss');

app.factory('boardService', function($http){
   return {
       getAll: function(){
           var promise = $http.get('boards').then(function(response){
              console.log(response);
               return response.data;
           });
           return promise;
       }
   };
});

app.directive("superhero", function(){
    return {
        restrict: 'E',
        scope: {},
        controller: function($scope, $element){
            $scope.abilities = [];

            this.addStrength = function(){
                $scope.abilities.push("strength");
            }

            this.addSpeed = function () {
                $scope.abilities.push("speed");
            }

            this.addFlight = function () {
                $scope.abilities.push("flight");
            }

        },

        link: function(scope, element){
            element.addClass("button");
            element.bind('mouseenter', function(){
                console.log(scope.abilities);
            });
            console.log(scope.attributes);
            for(var i in scope.abilities){
                element.innerHTML += scope.abilities[i];
            }
        },

        template: "{{abilities.join(', ')}}"
    };
});

app.directive('strength', function () {
    return {
        priority:1,
        require: "superhero",
        link: function(scope, element, attrs, superheroCtrl){
            superheroCtrl.addStrength();
        }
    }
});

app.directive('speed', function () {
    return {
        priority:1,
        require: "superhero",
        link: function(scope, element, attrs, superheroCtrl){
            superheroCtrl.addSpeed();
        }
    }
});

app.directive('flight', function () {
    return {
        priority:1,
        require: "superhero",
        link: function(scope, element, attrs, superheroCtrl){
            superheroCtrl.addFlight();
        }
    }
});