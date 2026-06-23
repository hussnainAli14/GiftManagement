import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Welcome from '../screens/auth/Welcome/Welcome';
import RoleSelection from '../screens/auth/RoleSelection/RoleSelection';
import Login from '../screens/auth/Login/Login';
import SignUp from '../screens/auth/SignUp/SignUp';
import ForgotPassword from '../screens/auth/ForgotPassword/ForgotPassword';
import OTP from '../screens/auth/OTP/OTP';
import Verify from '../screens/auth/Verify/Verify';
import ChangePassword from '../screens/auth/ChangePassword/ChangePassword';
import Success from '../screens/auth/Success/Success';
import Preferences from '../screens/auth/Preferences/Preferences';
import { getDefaultHeaderOptions, getHeaderBackButton } from './headerConfig';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Welcome"
    >
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen
        name="RoleSelection"
        component={RoleSelection}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Select Role',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
        })}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Log In',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
        })}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Sign Up',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
        })}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Forgot Password',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
        })}
      />
      <Stack.Screen
        name="OTP"
        component={OTP}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Enter OTP',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
        })}
      />
      <Stack.Screen
        name="Verify"
        component={Verify}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Verify Email',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
        })}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Set New Password',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
        })}
      />
      <Stack.Screen
        name="Success"
        component={Success}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Success',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
        })}
      />
      <Stack.Screen
        name="Preferences"
        component={Preferences}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Preferences',
          ...getDefaultHeaderOptions(),
          headerLeft: getHeaderBackButton(navigation),
        })}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
