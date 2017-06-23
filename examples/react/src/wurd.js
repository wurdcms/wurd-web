/**
 * This file instantiates a Wurd client by connecting to an app and setting options 
 * such as whether to open draft/edit mode, set the language etc.
 * It exports the client instance so it can be used elsewhere in the app.
 */

import Wurd from '../../dist/wurd'; //In your app, import from 'wurd-web'


const wurdClient = Wurd.connect('example', {
  editMode: true, //Always in edit mode
});


export default wurdClient;
