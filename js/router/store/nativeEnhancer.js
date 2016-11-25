import { Bluenet } from '../../native/Proxy'
import { BATCH } from './storeManager'
import { LOG, LOGDebug, LOGError } from '../../logging/Log'
import { sphereRequiresFingerprints, enoughCrownstonesForIndoorLocalization } from '../../util/dataUtil'


/**
 * This will ensure that the usage of the classifier will be done according
 * to when the fingerprints of all rooms are ready.
 *
 * @param getState
 * @returns {function(*): function(*=)}
 * @constructor
 */
export function NativeEnhancer({ getState }) {
  return (next) => (action) => {
    // Call the next dispatch method in the middleware chain.

    // required for some of the actions
    let oldState = getState();

    let returnValue = next(action);

    // state after update
    let newState = getState();


    let evaluateFingerprint = false;
    if (action.type === BATCH && action.payload && Array.isArray(action.payload)) {
      action.payload.forEach((action) => {
        evaluateFingerprint = evaluateFingerprint || checkAction(action);
      })
    }
    else {
      evaluateFingerprint = checkAction(action);
    }

    if (evaluateFingerprint) {
      let sphereId = action.sphereId;
      if (sphereId) {
        let requiresFingerprintsOld = sphereRequiresFingerprints(oldState, sphereId);
        let requiresFingerprintsNew = sphereRequiresFingerprints(newState, sphereId);
        let indoorLocalizationAllowedOld = enoughCrownstonesForIndoorLocalization(oldState, sphereId);
        let indoorLocalizationAllowedNew = enoughCrownstonesForIndoorLocalization(oldState, sphereId);

        let previousState = indoorLocalizationAllowedOld && !requiresFingerprintsOld;
        let nextState = indoorLocalizationAllowedNew && !requiresFingerprintsNew;

        if (previousState === false && nextState === true) {
          LOG("Starting indoor localization from nativeEnhancer");
          Bluenet.startIndoorLocalization();
        }
        else if (previousState === true && nextState === false) {
          LOG("Starting indoor localization from nativeEnhancer");
          Bluenet.stopIndoorLocalization();
        }
      }
    }

    // This will likely be the action itself, unless
    // a middleware further in chain changed it.
    return returnValue
  }
}

function checkAction(action) {
  let evaluateFingerprint = false;

  switch (action.type) {
    case 'ADD_LOCATION':
    case 'REMOVE_LOCATION':
      evaluateFingerprint = true;
      break;
    default:
      evaluateFingerprint = false;
  }

  return evaluateFingerprint;
}