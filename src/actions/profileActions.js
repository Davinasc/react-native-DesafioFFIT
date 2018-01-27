import { change, formValueSelector } from 'redux-form';
import {
  PROFILE_LIST_SUCCESS, HISTORIC_LIST_SUCCESS,
  PROFILE_UPDATE_HEIGHT_SUCESS, PROFILE_UPDATE_HEIGHT_FAIL,
  PROFILE_UPDATE_WEIGHT_FAIL, PROFILE_UPDATE_WEIGHT_SUCESS,
  PROFILE_UPDATE_GLYCEMIA_SUCCESS, PROFILE_UPDATE_GLYCEMIA_FAIL,
  PROFILE_UPDATE_BLOOD_PRESSURE_SUCCESS, PROFILE_UPDATE_BLOOD_PRESSURE_FAIL,
  START_LOADING, STOP_LOADING, RESET_PROFILE, PROFILE_PICTURE_SEND_SUCCESS,
  PROFILE_PICTURE_SEND_FAIL, PROFILE_PICTURE_UPDATE, PROFILE_UPDATE_HEART_BEAT_SUCCESS,
  PROFILE_UPDATE_HEART_BEAT_FAIL, PROFILE_UPDATE_TEMPERATURE_SUCCESS,
  PROFILE_UPDATE_TEMPERATURE_FAIL, PROFILE_CHANGE_SELECTOR_VISIBILITY, 
  PROFILE_UPDATE_IMC_SUCESS
} from '../constants'

import { getProfile, sendProfileInfo, sendProfilePictureRequest, removeProfilePictureRequest, getHistoric } from '../api';

export const listProfile = (silently) => (dispatch) => {
  if (!silently) {
    dispatch({ type: START_LOADING, payload: { msg: 'Carregando início...' } });
  }

  return getProfile().then((res) => {
    dispatch({ type: PROFILE_LIST_SUCCESS, payload: { data: res.data } });
    dispatch({
      type: PROFILE_PICTURE_UPDATE,
      payload: {
        data: {
          profile_picture: res.data.data.profile_picture,
        },
      },
    });
    if (res.data.data.height !== undefined) {
      dispatch(change('startPerfilAlturaForm', 'height', res.data.data.height.toFixed(2).toString().replace('.', ',')));
    } else {
      dispatch(change('startPerfilAlturaForm', 'height', ''));
    }

    if (res.data.data.weight !== undefined) {
      dispatch(change('startPerfilPesoForm', 'weight', res.data.data.weight.toFixed(2).toString().replace('.', ',')));
    } else {
      dispatch(change('startPerfilPesoForm', 'weight', ''));
    }

    if (res.data.data.imc !== undefined) {
      dispatch(change('startPerfilImcForm', 'imc', res.data.data.imc.toFixed(2).toString().replace('.', ',')));
    } else {
      dispatch(change('startPerfilImcForm', 'imc', ''));
    }

    if (res.data.data.glycemia !== undefined) {
      dispatch(change('startPerfilGlicemiaForm', 'glycemia', res.data.data.glycemia.toFixed(2).toString().replace('.', ',')));
    } else {
      dispatch(change('startPerfilGlicemiaForm', 'glycemia', ''));
    }

    if (res.data.data.blood_pressure.diastolic !== undefined && res.data.data.blood_pressure.systolic !== undefined) {
      dispatch(change('startPerfilPressaoForm', 'systolic', res.data.data.blood_pressure.systolic.toString().replace('.', ',')));
      dispatch(change('startPerfilPressaoForm', 'diastolic', res.data.data.blood_pressure.diastolic.toString().replace('.', ',')));
    } else {
      dispatch(change('startPerfilPressaoForm', 'systolic', ''));
      dispatch(change('startPerfilPressaoForm', 'diastolic', ''));
    }

    if (res.data.data.heart_beat !== undefined) {
      dispatch(change('startPerfilFrequenciaCardiacaForm', 'heart_beats', res.data.data.heart_beat.toString().replace('.', ',')));
    } else {
      dispatch(change('startPerfilFrequenciaCardiacaForm', 'heart_beats', ''));
    }

    if (res.data.data.temperature !== undefined) {
      dispatch(change('startPerfilTemperaturaForm', 'temperature', res.data.data.temperature.toString().replace('.', ',')));
    } else {
      dispatch(change('startPerfilTemperaturaForm', 'temperature', ''));
    }

    if (!silently) {
      dispatch({ type: STOP_LOADING });
    }
  }).catch((error) => {
    if (!silently) {
      dispatch({ type: STOP_LOADING });
    }
  });
};

export const fillProfile = data => (dispatch) => {
  if (data.height !== undefined) {
    dispatch(change('startPerfilAlturaForm', 'height', data.height.toFixed(2).toString().replace('.', ',')));
  }

  if (data.weight !== undefined) {
    dispatch(change('startPerfilPesoForm', 'weight', data.weight.toFixed(2).toString().replace('.', ',')));
  }

  if (data.imc !== undefined) {
    //dispatch(change('startPerfilImcForm', 'imc', data.imc.toFixed(2).toString().replace('.', ',')));
  }

  if (data.glycemia !== undefined) {
    dispatch(change('startPerfilGlicemiaForm', 'glycemia', data.glycemia.toFixed(2).toString().replace('.', ',')));
  }

  if (data.blood_pressure.diastolic !== undefined && data.blood_pressure.systolic !== undefined) {
    dispatch(change('startPerfilPressaoForm', 'systolic', data.blood_pressure.systolic.toString().replace('.', ',')));
    dispatch(change('startPerfilPressaoForm', 'diastolic', data.blood_pressure.diastolic.toString().replace('.', ',')));
  }

  if (data.heart_beat !== undefined) {
    dispatch(change('startPerfilFrequenciaCardiacaForm', 'heart_beats', data.heart_beat.toString().replace('.', ',')));
  }

  if (data.temperature !== undefined) {
    dispatch(change('startPerfilTemperaturaForm', 'temperature', data.temperature.toString().replace('.', ',')));
  }
};

export const getProfileInfo = silently => (dispatch) => {
  if (!silently) {
    dispatch({ type: START_LOADING, payload: { msg: 'Carregando início...' } });
  }
  return getProfile().then((res) => {
    dispatch({ type: PROFILE_LIST_SUCCESS, payload: { data: res.data } });
    dispatch({
      type: PROFILE_PICTURE_UPDATE,
      payload: {
        data: {
          profile_picture: res.data.data.profile_picture,
        },
      },
    });
    if (!silently) {
      dispatch({ type: STOP_LOADING });
    }
  }).catch((error) => {
    console.log('ERROR', error);
    console.log('ERROR', error.response);
    if (!silently) {
      dispatch({ type: STOP_LOADING });
    }
  });
};

export const confirmProfileInfo = profileData => (dispatch, getState) => {
  let selectorWeight = formValueSelector('startPerfilPesoForm');
  let selectorHeight = formValueSelector('startPerfilAlturaForm');
  let weight = selectorWeight(getState(), 'weight');
  let height = selectorHeight(getState(), 'height');

  if (weight && height && Number(weight.replace(',', '.')) > 0 && Number(height.replace(',', '.')) > 0) {
    let imc = Number(weight.replace(',', '.')) / ( Number(height.replace(',', '.')) * Number(height.replace(',', '.')) );
    dispatch(change('startPerfilImcForm', 'imc', imc.toFixed(2).toString().replace('.', ',')));
  }

  dispatch({ type: START_LOADING, payload: { msg: 'Enviando dados...' } }); 
  return sendProfileInfo(profileData).then((res) => {
    dispatch({ type: STOP_LOADING });
    switch (profileData.type) {
      case 'weights':
        dispatch({ type: PROFILE_UPDATE_WEIGHT_SUCESS, payload: { data: { message: 'Peso salvo com sucesso!', value: profileData.data.value } } }); break;
      case 'heights':
        dispatch({ type: PROFILE_UPDATE_HEIGHT_SUCESS, payload: { data: { message: 'Altura salva com sucesso!', value: profileData.data.value } } }); break;
      case 'glycemias':
        dispatch({ type: PROFILE_UPDATE_GLYCEMIA_SUCCESS, payload: { data: { message: 'Glicemia salva com sucesso!', value: profileData.data.value } } }); break;
      case 'blood_pressures':
        dispatch({ type: PROFILE_UPDATE_BLOOD_PRESSURE_SUCCESS, payload: { data: { message: 'Pressão salva com sucesso!', value: profileData.data } } }); break;
      case 'heart_beats':
        dispatch({ type: PROFILE_UPDATE_HEART_BEAT_SUCCESS, payload: { data: { message: 'Frequência cardíaca salva com sucesso!', value: profileData.data.value } } }); break;
      case 'temperatures':
        dispatch({ type: PROFILE_UPDATE_TEMPERATURE_SUCCESS, payload: { data: { message: 'Temperatura salva com sucesso!', value: profileData.data.value } } }); break;
    }
  }).catch((err) => {
    dispatch({type: STOP_LOADING});
    switch (profileData.type) {
      case 'weights':
        dispatch({type: PROFILE_UPDATE_WEIGHT_FAIL, payload: { data: { message: 'Peso não salvo. Tente novamente.' } } }); break;
      case 'heights':
        dispatch({type: PROFILE_UPDATE_HEIGHT_FAIL, payload: { data: { message: 'Altura não salvo. Tente novamente.' } } }); break;
      case 'glycemias':
        dispatch({type: PROFILE_UPDATE_GLYCEMIA_FAIL, payload: { data: { message: 'Glicemia não salva. Tente novamente.' } } }); break;
      case 'blood_pressures':
        dispatch({type: PROFILE_UPDATE_BLOOD_PRESSURE_FAIL, payload: { data: { message: 'Pressão não salva. Tente novamente.' } } }); break;
      case 'heart_beats':
        dispatch({type: PROFILE_UPDATE_HEART_BEAT_FAIL, payload: { data: { message: 'Frequência cardíaca não salva. Tente novamente.' } }}); break;
      case 'temperatures':
        dispatch({type: PROFILE_UPDATE_TEMPERATURE_FAIL, payload: { data: { message: 'Temperatura não salva. Tente novamente.' } } }); break;
    }
  });
};

export const dispatchProfileError = (type, msg) => (dispatch) => {
  switch (type) {
    case 'weights':
      dispatch({type: PROFILE_UPDATE_WEIGHT_FAIL, payload: { data: { message: msg } } }); break;
    case 'heights':
      dispatch({type: PROFILE_UPDATE_HEIGHT_FAIL, payload: { data: { message: msg } } }); break;
    case 'glycemias':
      dispatch({type: PROFILE_UPDATE_GLYCEMIA_FAIL, payload: { data: { message: msg } } }); break;
    case 'blood_pressures':
      dispatch({type: PROFILE_UPDATE_BLOOD_PRESSURE_FAIL, payload: { data: { message: msg } } }); break;
    case 'heart_beats':
      dispatch({type: PROFILE_UPDATE_HEART_BEAT_FAIL, payload: { data: { message: msg } }}); break;
    case 'temperatures':
      dispatch({type: PROFILE_UPDATE_TEMPERATURE_FAIL, payload: { data: { message: msg } } }); break;
  }
};

export const listHistoric = (type) => (dispatch) => {
  dispatch({ type: START_LOADING, payload: { msg: 'Carregando histórico...' } });
  return getHistoric(type).then(res => {
    let title = '', description = '', unit = '';
    switch (type) {
      case 'heights':
        title = 'Altura';
        unit = 'm';
        description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec bibendum at purus at ornare. Vestibulum a tincidunt eros, et sollicitudin felis. Proin rhoncus tristique convallis. Duis efficitur dui at enim luctus, eget placerat leo porttitor. Integer sodales fermentum lectus sit amet dictum. In hac habitasse platea dictumst. Mauris vel diam dolor. Integer in orci nisi. Cras et est turpis. Nulla at volutpat lorem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris scelerisque pharetra tellus sit amet ullamcorper.';
        break;
      case 'weights':
        title = 'Peso';
        unit = 'kg';
        description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec bibendum at purus at ornare. Vestibulum a tincidunt eros, et sollicitudin felis. Proin rhoncus tristique convallis. Duis efficitur dui at enim luctus, eget placerat leo porttitor. Integer sodales fermentum lectus sit amet dictum. In hac habitasse platea dictumst. Mauris vel diam dolor. Integer in orci nisi. Cras et est turpis. Nulla at volutpat lorem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris scelerisque pharetra tellus sit amet ullamcorper.';
        break;
      case 'glycemias':
        title = 'Glicemia capilar';
        unit = 'mg/dl';
        description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec bibendum at purus at ornare. Vestibulum a tincidunt eros, et sollicitudin felis. Proin rhoncus tristique convallis. Duis efficitur dui at enim luctus, eget placerat leo porttitor. Integer sodales fermentum lectus sit amet dictum. In hac habitasse platea dictumst. Mauris vel diam dolor. Integer in orci nisi. Cras et est turpis. Nulla at volutpat lorem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris scelerisque pharetra tellus sit amet ullamcorper.';
        break;
      case 'heart_beats':
        title = 'Frequência cardíaca';
        unit = 'bpm';
        description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec bibendum at purus at ornare. Vestibulum a tincidunt eros, et sollicitudin felis. Proin rhoncus tristique convallis. Duis efficitur dui at enim luctus, eget placerat leo porttitor. Integer sodales fermentum lectus sit amet dictum. In hac habitasse platea dictumst. Mauris vel diam dolor. Integer in orci nisi. Cras et est turpis. Nulla at volutpat lorem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris scelerisque pharetra tellus sit amet ullamcorper.';
        break;
      case 'temperatures':
        title = 'Temperaturas';
        unit = '°C';
        description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec bibendum at purus at ornare. Vestibulum a tincidunt eros, et sollicitudin felis. Proin rhoncus tristique convallis. Duis efficitur dui at enim luctus, eget placerat leo porttitor. Integer sodales fermentum lectus sit amet dictum. In hac habitasse platea dictumst. Mauris vel diam dolor. Integer in orci nisi. Cras et est turpis. Nulla at volutpat lorem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris scelerisque pharetra tellus sit amet ullamcorper.';
        break;
      case 'blood_pressures':
        title = 'Pressão';
        unit = '';
        description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec bibendum at purus at ornare. Vestibulum a tincidunt eros, et sollicitudin felis. Proin rhoncus tristique convallis. Duis efficitur dui at enim luctus, eget placerat leo porttitor. Integer sodales fermentum lectus sit amet dictum. In hac habitasse platea dictumst. Mauris vel diam dolor. Integer in orci nisi. Cras et est turpis. Nulla at volutpat lorem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris scelerisque pharetra tellus sit amet ullamcorper.';
        break;
      case 'imc':
        title = 'IMC';
        unit = '';
        description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec bibendum at purus at ornare. Vestibulum a tincidunt eros, et sollicitudin felis. Proin rhoncus tristique convallis. Duis efficitur dui at enim luctus, eget placerat leo porttitor. Integer sodales fermentum lectus sit amet dictum. In hac habitasse platea dictumst. Mauris vel diam dolor. Integer in orci nisi. Cras et est turpis. Nulla at volutpat lorem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris scelerisque pharetra tellus sit amet ullamcorper.';
        break;
    }

    dispatch({
      type: HISTORIC_LIST_SUCCESS,
      payload: {
        data: {
          title: title,
          description: description,
          unit: unit,
          data: res.data.data,
        },
      },
    });
    dispatch({ type: STOP_LOADING });
  }).catch(error => {
    dispatch({ type: STOP_LOADING });
  });
};

export const resetProfile = () => (dispatch) => {
  dispatch({ type: RESET_PROFILE });
};

export const changeWeightValue = data => (dispatch) => {
  let weight = Number(data.weight);
  let height = data.height;
  dispatch({ type: PROFILE_UPDATE_WEIGHT_SUCESS, payload: { data: { message: 'Peso salvo com sucesso!', value: weight } } });
  if (weight && height && weight > 0 && height > 0) {
    const imc = weight / (height * height);
    dispatch({ type: PROFILE_UPDATE_IMC_SUCESS, payload: { data: { message: 'Imc salvo com sucesso!', value: imc } } })
  }


};

export const changeHeightValue = data => (dispatch) => {
  const weight = data.weight;
  const height = Number(data.height.replace(',', '.'));
  dispatch({ type: PROFILE_UPDATE_HEIGHT_SUCESS, payload: { data: { message: 'Altura salva com sucesso!', value: height } } })
  if (weight && height && weight > 0 && height > 0) {
    const imc = weight / (height * height);
    dispatch({ type: PROFILE_UPDATE_IMC_SUCESS, payload: { data: { message: 'Imc salvo com sucesso!', value: imc } } })
  }
};

export const changePressureSystolicValue = data => (dispatch) => {
  const blood_pressure = { systolic: Number(data.blood_pressure.systolic), diastolic: data.blood_pressure.diastolic };
  dispatch({ type: PROFILE_UPDATE_BLOOD_PRESSURE_SUCCESS, payload: { data: { message: 'Pressao sistólica salva com sucesso!', value: blood_pressure } } })
}

export const changePressureDiastolicValue = data => (dispatch) => {
  const blood_pressure = { systolic: data.blood_pressure.systolic , diastolic: Number(data.blood_pressure.diastolic) };
  dispatch({ type: PROFILE_UPDATE_BLOOD_PRESSURE_SUCCESS, payload: { data: { message: 'Pressao sistólica salva com sucesso!', value: blood_pressure } } })
}

export const changeHeartBeatValue = data => (dispatch) => {
  const heart_beat = Number(data.heart_beat);
  dispatch({ type: PROFILE_UPDATE_HEART_BEAT_SUCCESS, payload: { data: { message: 'Frequência cardíaca salva com sucesso!', value: heart_beat } } });
}

export const changeGlycemiaValue = data => (dispatch) => {
  const glycemia = Number(data.glycemia);
  dispatch({ type: PROFILE_UPDATE_GLYCEMIA_SUCCESS, payload: { data: { message: 'Glicemia salva com sucesso!', value: glycemia } } });
}
export const changeTemperatureValue = data => (dispatch) => {
  const temperature = Number(data.temperature.replace(',', '.'));
  dispatch({ type: PROFILE_UPDATE_TEMPERATURE_SUCCESS, payload: { data: { message: 'Temperatura salva com sucesso!', value: temperature } } });
  // dispatch({ type: START_LOADING, payload: { msg: 'Enviando dados...' } });
  // return sendProfileInfo(data).then((res) => {
  //   dispatch({ type: STOP_LOADING });
  //   dispatch({ type: PROFILE_UPDATE_TEMPERATURE_SUCCESS, payload: { data: { message: 'Temperatura salva com sucesso!', value: temperature } } });
  // });
}