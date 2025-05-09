/**
 * Back side of the ticket component displaying a QR code.
 * Features a centered QR code with rounded corners and a gradient fill.
 * The QR code links to the reactiive.io demos page.
 */

import { LinearGradient } from '@shopify/react-native-skia';
import { View } from 'react-native';

export const BackSide = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {/* Gold to black gradient fill for QR code */}
        {/* <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 150, y: 150 }}
          colors={['#DAA520', '#000000']}
        /> */}
    </View>
  );
};
