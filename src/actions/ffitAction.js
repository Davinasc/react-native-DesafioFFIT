
import { getProfile } from '../api';

export const updateFfitToken = () => (dispatch) => {
  return getProfile().then((res) => {
    console.log('res', res);

  }).catch((error) => {

  });
};