'use strict';

import callApi from '../call_api';
import dispatcher from '../app_dispatcher';
import constants from '../constants';
import * as syncActions from './sync';
import * as streamActions from './stream';

/**
 * Fetch the loaded components as a way to validate the API.
 * Second argument is optional options object:
 *   - useStreaming: to enable streaming (default: true if supported)
 *   - rememberLogin: to store login in local storage (default: false)
 */
export function validate(authToken, {
    useStreaming=streamActions.isSupported(),
    rememberLogin=false,
  }) {

  dispatcher.dispatch({
    actionType: constants.ACTION_VALIDATING_AUTH_TOKEN
  });

  callApi('GET', '', false, {auth: authToken}).then(

    function() {
      dispatcher.dispatch({
        actionType: constants.ACTION_VALID_AUTH_TOKEN,
        authToken: authToken,
        rememberLogin: rememberLogin,
      });

      if (useStreaming) {
        streamActions.start(authToken);
      } else {
        syncActions.start();
      }
    }, 

    function(payload) {
      dispatcher.dispatch({
        actionType: constants.ACTION_INVALID_AUTH_TOKEN,
        message: payload.message,
      });
    });
}

export function logOut() {
  dispatcher.dispatch({
    actionType: constants.ACTION_LOG_OUT,
  });
}
