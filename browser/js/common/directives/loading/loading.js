app.directive('myLoading', function() {
    return {
        templateUrl: 'js/common/directives/loading/loading.html',
        restrict: 'E',
        scope: {
            message: '='
        }
    }
})