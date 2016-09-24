(function() {
    angular.module('simplejobs')
        .directive('sjCollapseSection', sjCollapseSection);

    sjCollapseSection.$inject = ['$rootScope', '$animateCss', '$timeout', '$state', '$compile', '$templateCache'];

    function sjCollapseSection($rootScope, $animateCss, $timeout, $state, $compile, $templateCache) {
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

            var getTargetHeight = function() { // This doesn't return a targetHeight value until after the DOM is rendered
                var targetHeight;

                target.addClass('no-transition');
                target.css('margin-top', '');

                targetHeight = target.prop('clientHeight');

                target.css('margin-top', 0);
                target.removeClass('no-transition');

                return targetHeight;
            };

            var isActive = function() {
                var items = angular.element(target[0].querySelectorAll('md-list-item a')); // Find each link

                angular.forEach(items, function(item) {
                    if ($state.current.name == item.attributes['ui-sref'].value) {
                        activeState = true;
                        ctrl.collapsed = false;
                    }
                });
            };

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
                } else {
                    if (!activeState) {
                        target.css('margin-top', (-getTargetHeight() + 'px')); // hide the panel
                    }
                }
            });
        }
    }
})();