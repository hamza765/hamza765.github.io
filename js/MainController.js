app.controller('MainController', ['$scope', '$sce', function($scope, $sce) {
    $scope.questions = [{
        "id": 1,
        "content": "Figure out what you need",
        "answers": ["Let's get started"],
        "routes": [3]
    }, {
        "id": 2,
        "content": "Do you need to secure a website?",
        "answers": ["Yes", "No"],
        "routes": [3, 4]
    }, {
        "id": 3,
        "content": "Do you need to secure multiple domains?",
        "answers": ["Yes", "No"],
        "routes": [6, 5],
        "tips": "Example: example1.com or example2.com"
    }, {
        "id": 4,
        "content": "What do you need to secure?",
        "answers": ["Code Signing"],
        "routes": [18]

    }, {
        "id": 5,
        "content": "Do you need to secure multiple sub-domains?",
        "answers": ["Yes", "No"],
        "routes": [7, 8],
        "tips": "Examples for subdomains would be www.example.com, mail.example.com, autodiscover.example.com, *.example.com"
    }, {
        "id": 6,
        "content": "Do you want the green address bar?",
        "answers": ["Yes", "No"],
        "routes": [15, 14],
        "tips": "Example: <img src='images/green-bar.png'>"
    }, {
        "id": 7,
        "content": "Do you need to secure more than three sub-domains?",
        "answers": ["Yes", "No"],
        "routes": [13, 12],
        "tips": "Examples for subdomains would be www.example.com, mail.example.com, autodiscover.example.com, *.example.com"
    }, {
        "id": 8,
        "content": "Do you want the green address bar? (2)",
        "answers": ["Yes", "No"],
        "routes": [16, 9],
        "tips": "Example: <img src='images/green-bar.png'>"
    }, {
        "id": 9,
        "content": "Do you need to list your Company name in the certificate details?",
        "answers": ["Yes", "No"],
        "routes": [11, 10],
        "tips": "Example: <img src='images/globalsign-com-certificate-view.png'>"
    }, {
        "id": 10,
        "content": "Based on your answer, we have determined that the <a class='sslurl' href='http://www.ssl.com/certificates/basicssl'>Basic SSL</a> plan is the best fit for you!",
        "answers": ["Proceed to the Basic SSL page"],
        "url": "http://www.ssl.com/certificates/basicssl"
    }, {
        "id": 11,
        "content": "Based on your answer, we have determined that the <a class='sslurl' href='http://www.ssl.com/certificates/high_assurance'>High Assurance</a> SSL plan is the best fit for you!",
        "answers": ["Proceed to the High Assurance SSL page"],
        "url": "https://www.ssl.com/certificates/high_assurance"
    }, {
        "id": 12,
        "content": "Based on your answer, we have determined that the <a class='sslurl' href='http://www.ssl.com/certificates/premiumssl'>Premium</a> SSL plan is the best fit for you!",
        "answers": ["Proceed to the Premium SSL page"],
        "url": "http://www.ssl.com/certificates/premiumssl"

    }, {
        "id": 13,
        "content": "Based on your answer, we have determined that the <a class='sslurl' href='http://www.ssl.com/certificates/wildcard'>Wildcard</a> SSL plan is the best fit for you!",
        "answers": ["Proceed to the Wildcard SSL page"],
        "url": "http://www.ssl.com/certificates/wildcard"
    }, {
        "id": 14,
        "content": "Based on your answer, we have determined that the <a class='sslurl' href='http://www.ssl.com/certificates/ucc'>UCC/SAN</a> SSL plan is the best fit for you!",
        "answers": ["Proceed to the UCC/SAN SSL page"],
        "url": "http://www.ssl.com/certificates/ucc"
    }, {
        "id": 15,
        "content": "Based on your answer, we have determined that the <a class='sslurl' href='http://www.ssl.com/certificates/evucc'>EV UCC/SAN</a> SSL plan is the best fit for you!",
        "answers": ["Proceed to the EV UCC SSL page"],
        "url": "http://www.ssl.com/certificates/evucc"
    }, {
        "id": 16,
        "content": "Based on your answer, we have determined that the <a class='sslurl' href='http://www.ssl.com/certificates/ev'>Enterprise EV</a> plan is the best fit for you!",
        "answers": ["Proceed to the Enterprise EV SSL page"],
        "url": "http://www.ssl.com/certificates/ev"
    }, {
        "id": 17,
        "content": "To purchase an Email SSL certificate, please email us at: support@ssl.com",


    }, {
        "id": 18,
        "content": "Based on your answer, we have determined that the Code Signing plan is the best fit for you!",
        "answers": ["Proceed to the Code Signing page"],
        "url": "http://www.ssl.com/certificates/code-signing"
    }];

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
