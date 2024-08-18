import AsyncStorage from '@react-native-async-storage/async-storage';

const signUpUser = async (email, password) => {
    console.log('trying to add user');
    console.log('dev env ', process.env.EXPO_PUBLIC_DEV_URL);
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_DEV_URL}/api/users/register/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      },
    );

    const data = await response.json();

    if (response.ok) {
      await AsyncStorage.setItem('userToken', data.token);
      console.log('created account!');
      return { success: true, token: data.token };
    } else if (response.status === 400 && data.error === 'Email already in use') {
      return { success: false, message: 'Email already in use' };
    } else {
      return { success: false, message: 'Registration failed' };
    }
  } catch (error) {
    console.error('Network or server error', error);
    return { success: false, message: 'Network or server error' };
  }
};

export default signUpUser;
