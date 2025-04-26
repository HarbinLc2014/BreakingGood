/**
 * Main application entry point for the Ticket Demo app.
 * Displays a flippable ticket with front and back sides in a centered layout.
 */

import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { Ticket } from './ticket';
import { FrontSide } from './ticket/front-side';
import { BackSide } from './ticket/back-side';

/**
 * Root component of the application.
 * Sets up the main layout with a dark background and centered ticket.
 */
export const ThreadsHoloTicket = (frontImage: any, backImage: any) => {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {/* Ticket container with elevated z-index to ensure proper rendering */}
      <View style={{ zIndex: 10000 }}>
        <Ticket
          width={300}
          height={400}
          frontSide={frontImage}
          backSide={backImage} image={undefined} backImage={undefined} toX={0} toY={0} delay={0}        />
      </View>
    </View>
  );
};

/**
 * Global styles for the app
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070018', // Dark purple background
    alignItems: 'center',
    justifyContent: 'center',
  },
});
