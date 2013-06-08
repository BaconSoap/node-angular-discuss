var app = angular.module('discuss');

app.controller('SideNavCtrl', function($scope){
    $scope.menuItems = [
        {title:'Apple'},
        {title:'Orange'}
    ]
});