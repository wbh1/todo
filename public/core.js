/**
 * Created by Will on 9/14/2016.
 */
var scotchTodo = angular.module('scotchTodo', []);

function mainController($scope, $http) {
    $scope.formData = {};

    // when landing on the page, get all the todos and show them. hits the API server views
    $http.get('/api/todos')
        .success(function (data) {
            $scope.todos = data;
            console.log(data);
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node api in Server.js
    $scope.createTodo = function () {
        $http.post('/api/todos', $scope.formData)
            .success(function (data) {
                $scope.formData = {};  // clears the form since it processed the new add
                $scope.todos = data; // updates the list
                console.log(data);  // we all love logging <3
            })
            .error(function (data) {
                console.log('Error: ' + data); // logs errors
            });
    };

    // delete a todo after checking it
    $scope.deleteTodo = function (id) {
        $http.delete('/api/todos/' + id)
            .success(function (data) {
                $scope.todos = data; // update list
                console.log(data); // log success
            })
            .error(function (data) {
                console.log('Error: ' + data);  // log failure
            });
    };
}