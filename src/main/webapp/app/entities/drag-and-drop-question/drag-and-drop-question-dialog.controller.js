(function() {
    'use strict';

    angular
        .module('exerciseApplicationApp')
        .controller('DragAndDropQuestionDialogController', DragAndDropQuestionDialogController);

    DragAndDropQuestionDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'DragAndDropQuestion', 'DropLocation', 'DragItem'];

    function DragAndDropQuestionDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, DragAndDropQuestion, DropLocation, DragItem) {
        var vm = this;

        vm.dragAndDropQuestion = entity;
        vm.clear = clear;
        vm.save = save;
        vm.droplocations = DropLocation.query();
        vm.dragitems = DragItem.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.dragAndDropQuestion.id !== null) {
                DragAndDropQuestion.update(vm.dragAndDropQuestion, onSaveSuccess, onSaveError);
            } else {
                DragAndDropQuestion.save(vm.dragAndDropQuestion, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('exerciseApplicationApp:dragAndDropQuestionUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();
