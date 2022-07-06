import {Amplify} from 'aws-amplify';
// @ts-ignore
import {withAuthenticator} from 'aws-amplify-react-native';
import {Analytics} from '@aws-amplify/analytics';
import PushNotification from '@aws-amplify/pushnotification';
import {Auth} from '@aws-amplify/auth';

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import awsmobile from './src/aws-exports';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

Amplify.configure(awsmobile);
Auth.configure(awsmobile);
Analytics.configure(awsmobile);
PushNotification.configure(awsmobile);

PushNotification.onRegister((token: any) => {
  console.log('in app registration', token);
  Analytics.updateEndpoint({
    address: token, // The unique identifier for the recipient. device token
    // optOut: 'NONE',
    // from s.o. https://stackoverflow.com/questions/57810979/how-to-properly-configure-amplify-analytics
    // As you are using Cognito, Amazon Cognito can add user IDs and attributes to your endpoints automatically.
    // For the endpoint user ID value, Amazon Cognito assigns the sub value that's assigned to the user in the user pool.
    // userId: user,  this would be the user sub
  })
    .then(data => {
      console.log('endpoint updated', JSON.stringify(data));
    })
    .catch(error => {
      console.log('error updating endpoint', error);
    });
});

PushNotification.onNotification((notification: any) => {
  // display notification in debug log in XCode
  console.log('in app notification received', notification);
  notification.finish(PushNotificationIOS.FetchResult.NoData);
});

PushNotification.requestIOSPermissions();

const Section: React.FC<{
  title: string;
  children: any;
}> = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits. Ok its changed
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default withAuthenticator(App);
