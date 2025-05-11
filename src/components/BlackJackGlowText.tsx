// // BlackJackGlowText.tsx
// import React, { useEffect } from 'react';
// import { Text, StyleSheet } from 'react-native';
// import Animated, {
//   Easing,
//   useSharedValue,
//   useAnimatedStyle,
//   withRepeat,
//   withTiming,
//   FadeIn,
//   FadeOut,
// } from 'react-native-reanimated';

// const BlackJackGlowText = () => {
//   const glow = useSharedValue(1);

//   useEffect(() => {
//     glow.value = withRepeat(
//       withTiming(2, {
//         duration: 800,
//         easing: Easing.ease,
//       }),
//       -1,
//       true,
//     );
//   }, []);

//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: glow.value }],
//     textShadowRadius: glow.value * 10,
//   }));

//   return (
//     <Animated.Text
//       entering={FadeIn.duration(300)}
//       exiting={FadeOut.duration(1000)}
//       style={[styles.text, animatedStyle]}
//     >
//       BLACK JACK!
//     </Animated.Text>
//   );
// };

// export default BlackJackGlowText;

// const styles = StyleSheet.create({
//   text: {
//     fontSize: 40,
//     fontWeight: 'bold',
//     color: 'gold',
//     textAlign: 'center',
//     position: 'absolute',
//     top: '40%',
//     alignSelf: 'center',
//     textShadowColor: '#FFD700',
//     textShadowOffset: { width: 0, height: 0 },
//     textShadowRadius: 10,
//   },
// });


import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Animated, { Easing, withRepeat, withTiming, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { Canvas, matchFont, Text, useCanvasRef } from '@shopify/react-native-skia';
const fontFamily = Platform.select({ ios: "Helvetica", default: "serif" });
const fontStyle = {
  fontFamily,
  fontSize: 42,
  fontStyle: "italic" as const,
  fontWeight: "bold" as const,
} as const;
const font = matchFont(fontStyle);
const BlackJackGlowText = () => {
  const [isVisible, setIsVisible] = useState(false);

  const glowRadius = useSharedValue(10);
  const glowOpacity = useSharedValue(0.5);
  
  const canvasRef = useCanvasRef();

  useEffect(() => {
    // 控制光环发散的动画效果
    glowRadius.value = withRepeat(
      withTiming(50, {
        duration: 1000,
        easing: Easing.ease,
      }),
      -1,
      true
    );

    glowOpacity.value = withRepeat(
      withTiming(1, {
        duration: 1000,
        easing: Easing.ease,
      }),
      -1,
      true
    );

    // 模拟 Blackjack 显示
    setTimeout(() => setIsVisible(true), 1000);
    setTimeout(() => setIsVisible(false), 3500); // 自动消失
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: glowRadius.value,
    shadowOpacity: glowOpacity.value,
    textShadowRadius: glowRadius.value,
    textShadowColor: '#FFD700', // 光辉颜色
  }));

  return (
    <View style={styles.container}>
      {isVisible && (
        <Canvas ref={canvasRef} style={styles.canvas}>
          <Text
            x={150}
            y={200}
            text="BLACK JACK!"
            font={font}
            color="gold"
            {...glowStyle}
          />
        </Canvas>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '0%',
    left: '-30%',
    backgroundColor: 'blue',
    transform: [{ translateX: -150 }],
  },
  canvas: {
    width: 300,
    height: 300,
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export default BlackJackGlowText;
