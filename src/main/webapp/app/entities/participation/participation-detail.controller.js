(function() {
    'use strict';

    angular
        .module('exerciseApplicationApp')
        .controller('ParticipationDetailController', ParticipationDetailController);

    ParticipationDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'entity', 'Participation', 'Result', 'User', 'Exercise'];

    function ParticipationDetailController($scope, $rootScope, $stateParams, previousState, entity, Participation, Result, User, Exercise) {
        var vm = this;

        vm.participation = entity;
        vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('exerciseApplicationApp:participationUpdate', function(event, result) {
            vm.participation = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
