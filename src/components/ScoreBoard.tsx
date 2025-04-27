import { Canvas, Text as SkiaText, Paint, LinearGradient, vec } from "@shopify/react-native-skia";
import React, { useEffect } from "react";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { View } from "react-native";

export function ScoreBoard({ playerPts, font }: { playerPts: number; font: any }) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = 0.8; // 先缩小
    scale.value = withSpring(1, {
      damping: 5,
      stiffness: 200,
    }); // 然后弹回来
  }, [playerPts]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[{ marginTop: 150, height: 50, width: 200, alignItems: "center", justifyContent: "center" }, animatedStyle]}>
      <Canvas style={{ height: 50, width: 200 }}>
        <SkiaText
          text={`Pts: ${playerPts}`}
          x={30}
          y={35}
          font={font}
        >
          <Paint>
            <LinearGradient
              start={vec(20, 0)}
              end={vec(190, 0)}
              colors={[
                "#000",
                "#FFD700",
                "#FFC107",
                "#FFB300",
                "#FFD700",
                "#fff",
              ]}
            />
          </Paint>
        </SkiaText>
      </Canvas>
    </Animated.View>
  );
}
