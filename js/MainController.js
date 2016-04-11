app.controller('MainController', ['$scope', '$sce', function($scope, $sce) {
    

    $scope.questionContent = $sce.trustAsHtml($scope.questions[0].content);
    $scope.questionTip = $sce.trustAsHtml($scope.questions[0].tips);

    $scope.logarray = [0];
    $scope.currentQuestion = 0;
    $scope.setQuestion = function(id) {
        $scope.currentQuestion = id - 1;
        var templog = $scope.logarray;
        templog.push($scope.currentQuestion);
        $scope.logarray = templog;
        $scope.questionContent = $sce.trustAsHtml($scope.questions[$scope.currentQuestion].content);
        $scope.questionTip = $sce.trustAsHtml($scope.questions[$scope.currentQuestion].tips);
    }

    $scope.goBack = function(id) {
        var templog = $scope.logarray;
        templog.pop(id);
        $scope.logarray = templog;
        $scope.currentQuestion = templog[templog.length - 1];
        $scope.questionContent = $sce.trustAsHtml($scope.questions[$scope.currentQuestion].content);
        $scope.questionTip = $sce.trustAsHtml($scope.questions[$scope.currentQuestion].tips);
    }

}]);
