# Notes file

This is the backend to 954live. It will be independent from the Drupal website and use the JSONapi.org spec REST server to manage Drupal entities. Headless Drupal.


## Project goals
1. Event importers on client should be plugable. Will try to build them by dependency injection. It will start with only using the TicketMaster API.
It needs to be able to define different types of event information sources, menu item (?), and a map between the JSON object properties and database fields.
2. Authentication is not an immediate concern. Keep in mind people should be able to manage their own information. So much overhead. Provide for node edit access for user reference. That way several people can own a content type, ie. a venue, event, or artist.
3. Create a media entity type for images so that images can contain photographer attribution and link. Absolute position attribution on image.
4. Create a taxonomy term for every [TicketMaster market](http://ticketmaster-api.github.io/products-and-docs/apis/discovery/#supported-markets) to attach to each event.
5. Use dependency injection to define search information importers from different sources to normalize information for information types.
.... For example, [get access token to facebook graph api](http://stackoverflow.com/questions/7633234/get-public-page-statuses-using-facebook-graph-api-without-access-token)
.... Make artist information available to [importing](https://developers.facebook.com/docs/graph-api/reference/page/). https://graph.facebook.com/v2.5/DeLongMusic?fields=band_members,description,bio&access_token=SECRET_ACCESS_TOKEN

## Todo
1. ~~Define directory structure.~~
2. ~~Build index.html. Try to implement grunt usemin (https://github.com/yeoman/grunt-usemin) and
 grunt wire dependencies (https://github.com/stephenplusplus/grunt-wiredep).~~
3. ~~Don't worry about implementing grunt usemin. Probably won't add efficiency over the hassle of managing all the edge cases.
 Instead wire up grunt concat (https://github.com/gruntjs/grunt-contrib-concat)
 with grunt angular templates (https://www.npmjs.com/package/grunt-angular-templates)
 and grunt uglify (https://github.com/gruntjs/grunt-contrib-uglify). The files are piped through these formatters and saved in the dist directory.~~
4. The one thing missing on the automated workflow with grunt is client side Angular testing. That will be wired up now.



## Misc
1. Don't have a MEAN generator that isn't complicated so I'm trying this scratch.
2. I went overboard and wired up grunt to do everything! There is a build pipeline which gets pushed to heroku. Here is a Reddit thread on pushing a build folder to be used on [Heroku](https://www.reddit.com/r/javascript/comments/47snko/how_do_i_keep_a_development_repository_on_github/)
3. When deploying in production on heroku without using grunt build [bower needs to install scripts on the remote server](http://xseignard.github.io/2013/02/18/use-bower-with-heroku/).