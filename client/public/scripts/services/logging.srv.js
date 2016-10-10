(function() {
    angular.module('simplejobs')
        .factory('sjLogger', sjLogger);

    sjLogger.$inject = ['$window', 'Analytics', 'Auth'];

    function sjLogger($window, Analytics, Auth) {
        var googleAnalyticsEvent = Analytics.trackEvent,
            facebookPixelEvent = $window.fbq;

        return {
            logEvent: logEvent
        };


        /**
         * Google Analytics
         * ----------------
         * Category: Job || Resume
         * Event action: ViewListing || EditListing || DownloadResume
         * Dimension 1: JobType
         * Dimension 2: Position
         * Dimension 3: LocationName
         * Dimension 4: VesselType
         * Dimension 5: UserId
         *
         * Facebook Pixel
         * ________________
         * EventAction: ViewListing || EditListing || DownloadResume
         * Event (Category): Job || Resume
         * EventLabel: JobType
         * Position: Position
         * LocationName: LocationName
         * VesselType: VesselType
         *
         * event: {
         *     action: [string],
         *     category: [string],
         *     jobType: [string],
         *     position: [string],
         *     locationName: [string],
         *     vesselType: [string]
         * }
         */
        function logEvent(event) {
            var user = Auth.getMe();

            // (category, action, label, value, noninteraction, custom)
            // The event position value in the label is redundant but semantically incorrect in the analytics dashboard it should
            // be labeled position under a dimension but Event label is a major default dimension. So I'm sacrificing one of
            // the 100 custom dimensions for redundancy. I can change this later if it doesn't make sense. Deal with it.
            googleAnalyticsEvent(event.category, event.action, event.position, {
                dimension1: event.jobType,
                dimension2: event.position,
                dimension3: event.locationName,
                dimension4: event.vesselType,
                dimension5: user._id
            });

            facebookPixelEvent('trackCustom', event.action, {
                Category: event.category,
                JobType: event.jobType,
                Position: event.position,
                LocationName: event.locationName,
                VesselType: event.vesselType
            });

        }
    }
})();