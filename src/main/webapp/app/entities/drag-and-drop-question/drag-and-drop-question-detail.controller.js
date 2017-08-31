(function() {
    'use strict';

    angular
        .module('exerciseApplicationApp')
        .controller('DragAndDropQuestionDetailController', DragAndDropQuestionDetailController);

    DragAndDropQuestionDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'entity', 'DragAndDropQuestion', 'DropLocation', 'DragItem'];

    function DragAndDropQuestionDetailController($scope, $rootScope, $stateParams, previousState, entity, DragAndDropQuestion, DropLocation, DragItem) {
        var vm = this;

        vm.dragAndDropQuestion = entity;
        vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('exerciseApplicationApp:dragAndDropQuestionUpdate', function(event, result) {
            vm.dragAndDropQuestion = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
