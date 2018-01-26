import React from 'react';
import { Scene, Router, Modal, Reducer, Tabs, ActionConst, Actions } from 'react-native-router-flux';

import TabBarButton from './components/common/button/TabBarButton';

import SplashScreen from './SplashScreen';
import LaunchScreen from './components/Launch';
import AuthScreen from './components/Auth';
import StartPerfilScreen from './components/StartPerfil';
import Medicine from './components/Medicine';
import MedicineForm from './components/Medicine/MedicineForm';

import * as medicineActions from './actions/medicineActions';

const reducerCreate = params => {
  const defaultReducer = Reducer(params);
  return (state, action) => {
    return defaultReducer(state, action);
  };
}

const TabIconPerfil = ({ focused, title }) => {
  return (
    <TabBarButton
      selected={focused}
      title={title}
      imageActive={require('../src/lib/Images/perfil_active.png')}
      imageInactive={require('../src/lib/Images/perfil_inactive.png')}
      notificationCounter
      useProfilePicture
      renderDrawer
    />
  );
};

const RouterComponent = (props) => {
  return (
    <Router
      createReducer={reducerCreate}
      sceneStyle={{backgroundColor: 'white'}}
    >
      <Scene key="modal" component={Modal}>
        <Scene key="root" hideNavBar panHandlers={null}>
          <Scene
            key="splash"
            component={SplashScreen}
            title="Splash"
            initial
          />

          <Scene
            key="launch"
            component={LaunchScreen}
            title="Launch"
          />

          <Scene
            key="auth"
            component={AuthScreen}
            title="Authentication"
          />

          <Tabs
            key="app"
            activeTintColor="#5C6BC0"
            inactiveTintColor="#848484"
            tabBarStyle={{ backgroundColor: '#F1F1F1', height: 55 }}
            tabBarPosition="bottom"
            animationEnabled
            showLabel={false}
            swipeEnabled={false}
          >
            <Scene
              key="perfil"
              title="Início"
              icon={TabIconPerfil}
              panHandlers={null}
              gesturesEnabled={false}
            >
              <Scene
                key="start_perfil"
                component={StartPerfilScreen}
                title="Perfil"
                hideNavBar
                type={ActionConst.BACK_ACTION}
              />

              <Scene
                key="medicines_group"
                title="Meus medicamentos"
                hideNavBar
                hideTabBar
              >
                <Scene
                  key="medicines_list"
                  component={Medicine}
                  title="Meus medicamentos"
                  hideNavBar
                  hideTabBar
                  type={ActionConst.BACK_ACTION}
                  onEnter={() => {
                    props.dispatch(medicineActions.listMedicines());
                  }}
                />
                <Scene
                  key="medicine_form"
                  component={MedicineForm}
                  title="Medicamentos - Form"
                  hideNavBar
                  hideTabBar
                />
              </Scene>
            </Scene>
          </Tabs>
        </Scene>
      </Scene>
    </Router>
  );
}

export default RouterComponent;
