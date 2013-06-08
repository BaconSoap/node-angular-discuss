describe("Apples", function(){
    var elem, scope;

    beforeEach(module("discuss"));
    beforeEach(inject(function($rootScope, $compile){
        elem = angular.element('<superhero strength>Andrew</superhero>');
        scope = $rootScope;
        $compile(elem)(scope);
        scope.$digest();
    }));

    it("should find strength", function(){
        expect(elem[0].innerText.indexOf("strength")).toBeGreaterThan(-1);
    });
});