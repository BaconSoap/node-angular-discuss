var app = angular.module('discuss');

app.controller('SideNavCtrl', function(boardService, $scope){
    boardService.getAll().then(function(d){
        console.log(d);
        $scope.menuItems = d.map(function(r){return {title: r.name, id: r.id};});
    });
});