(function() {
    angular.module('simplejobs')
        .run(run);

    run.$inject = ['$rootScope', '$window'];

    function run($rootScope, $window) {
        $rootScope.$on('$stateChangeSuccess', function(event, toState) {
            var description = $window.description = toState.data && toState.data.description ? toState.data.description :
                "Why does getting a job on a yacht have to be so damn complicated?";

            angular.element(document.querySelector('meta[name=description]')).remove();
            var meta = document.createElement('meta');
            meta.name = 'description';
            meta.content = description;
            document.head.appendChild(meta);

            $window.title = document.title = toState.data && toState.data.title && toState.data.title !== 'Home' ? toState.data.title + ' | Simple Yacht Jobs' :
                'Simple Yacht Jobs';
        })
    }
})();