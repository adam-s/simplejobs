(function() {
    angular.module('simplejobs')
        .directive('sjCollapseSection', sjCollapseSection);

    sjCollapseSection.$inject = ['$animateCss', '$timeout', '$state'];

    function sjCollapseSection($animateCss, $timeout, $state) {
        return {
            controller: 'sjCollapseSectionCtrl',
            controllerAs: 'ctrl',
            templateUrl: 'scripts/components/sjCollapseSection/sjCollapseSection.tpl.html',
            link: link,
            bindToController: true,
            transclude: true,
            scope: {
                section: '@'
            }
        };

        function link(scope, element, attrs, ctrl) {
            var activeState = false; // Store whether this element slider is open {active} or closed

            var target = angular.element(element[0].querySelector('.ht'))[0]; // Find the div that contains the link
            target = angular.element(target); // Unlike jquery a wrapped DOM object wasn't returned above.

            // Hide element until after processing
            target.css('display', 'hidden');

            isActive(); // Initialize isActive();

            scope.$on('$stateChangeSuccess', function() {
                activeState = false; // Reset
                ctrl.collapsed = true;
                isActive();
            });

            scope.$watch(function() {
                return ctrl.collapsed;
            }, function(newValue, oldValue) {
                if (newValue != oldValue) { // Skip first when linking
                    $timeout(function() {
                        $animateCss(target, {
                            from: {
                                'margin-top': newValue ? 0 : (-getTargetHeight() + 'px')
                            },
                            to: {
                                'margin-top': newValue ? (-getTargetHeight() + 'px') : 0
                            },
                            duration: 0.3
                        }).start();
                    }, 0, false)
                }
            });

            function getTargetHeight() {
                var targetHeight,
                    body = angular.element(document.querySelector('body')).eq(0);

                var cloneTarget = angular.copy(target)
                    .css('position', 'absolute')
                    .css('top', '-1000')
                    .css('display', 'table');

                body.append(cloneTarget);
                targetHeight = cloneTarget.prop('clientHeight');
                cloneTarget.remove();
                return targetHeight;
            }

            function isActive() {
                var items = target[0].querySelectorAll('md-list-item a'); // Find each link

                angular.forEach(items, function(item) {
                    if ($state.current.name == item.attributes['ui-sref'].value) {
                        activeState = true;
                        ctrl.collapsed = false;
                    }
                });

                if (!activeState) {
                    target.css('margin-top', (-getTargetHeight() + 'px')); // hide the panel
                }
            }
        }
    }
})();