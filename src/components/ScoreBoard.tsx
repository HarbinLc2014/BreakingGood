// import { Canvas, Text as SkiaText, Paint, LinearGradient, vec } from "@shopify/react-native-skia";
// import React, { useEffect } from "react";
// import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
// import { View } from "react-native";

// export function ScoreBoard({ playerPts, font }: { playerPts: number; font: any }) {
//   const scale = useSharedValue(1);

//   useEffect(() => {
//     scale.value = 0.8; // 先缩小
//     scale.value = withSpring(1, {
//       damping: 5,
//       stiffness: 200,
//     }); // 然后弹回来
//   }, [playerPts]);

//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: scale.value }],
//   }));

//   return (
//     <Animated.View style={[{ height: 50, width: 200, alignItems: "center", justifyContent: "center" }, animatedStyle]}>
//       <Canvas style={{ height: 50, width: 200 }}>
//         <SkiaText
//           text={`Pts: ${playerPts}`}
//           x={30}
//           y={35}
//           font={font}
//         >
//           <Paint>
//             <LinearGradient
//               start={vec(20, 0)}
//               end={vec(190, 0)}
//               colors={[
//                 "#000",
//                 "#FFD700",
//                 "#FFC107",
//                 "#FFB300",
//                 "#FFD700",
//                 "#fff",
//               ]}
//             />
//           </Paint>
//         </SkiaText>
//       </Canvas>
//     </Animated.View>
//   );
// }
import {
  Canvas,
  Group,
  Text as SkiaText,
  Paint,
  LinearGradient,
  vec,
} from "@shopify/react-native-skia";
import React, { useEffect, useState } from "react";
import Animated, {
  useSharedValue,
  useDerivedValue,
  withSpring,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import { View } from "react-native";

export function ScoreBoard({
  playerPts,
  font,
  type,
  animation = true,
}: {
  playerPts: number;
  font: any;
  type: string;
  animation: boolean;
}) {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [colors, setColors] = useState([
    "#000000",
    "#FFD700",
    "#FFC107",
    "#FFB300",
    "#FFD700",
    "#FFFFFF",
  ]);
  useEffect(() => {
    if (playerPts === 21 && animation) {
      // 达到21，弹一下，变金色
      scale.value = withSpring(1.6, { stiffness: 300, damping: 5 });
      setColors(["#fff"]);
      setTimeout(() => {
        setColors([
          "#000000",
          "#FFD700",
          "#FFC107",
          "#FFB300",
          "#FFD700",
          "#FFFFFF",
        ]);
      }, 100);
      setTimeout(() => {
        setColors(["#FFFFFF"]);
      }, 200);
      setTimeout(() => {
        setColors([
          "#000000",
          "#FFD700",
          "#FFC107",
          "#FFB300",
          "#FFD700",
          "#FFFFFF",
        ]);
      }, 300);
      setTimeout(() => {
        scale.value = withSpring(1);
        // setColors(["#FFFFFF"]);
      }, 500);
    } else if (playerPts > 21) {
      // 超过21，抖动
      setTimeout(() => {
        // scale.value = withSpring(0.8);
        rotate.value = withTiming(10, { duration: 100 });
        setColors(["#FF0000"]);
        setTimeout(() => {
          rotate.value = withTiming(-10, { duration: 100 });
        }, 100);
        setTimeout(() => {
          rotate.value = withTiming(0, { duration: 100 });
        }, 200);
      }, 100);
    } else {
      if (animation) {
        scale.value = withSpring(1.2, { stiffness: 300, damping: 8 });
        setTimeout(() => {
          scale.value = withSpring(1);
        }, 200);
        rotate.value = withTiming(0);
        //   setColors(["#FFFFFF"]);
      }
    }
  }, [playerPts]);

  // 用View包一层，外面用Animated控制变换
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotateZ: `${rotate.value}deg` }],
  }));

  return (
    <Animated.View
      style={[
        {
          height: 50,
          width: 300,
          alignItems: "center",
          justifyContent: "center",
        },
        animatedStyle,
      ]}
    >
      <Canvas
        style={{
          height: 50,
          width: 300,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Group>
          <SkiaText
            text={`${type}: ${playerPts}`}
            x={60}
            y={35}
            font={font}
            color={textColor}
          >
            <Paint>
              <LinearGradient
                start={vec(20, 0)}
                end={vec(260, 0)}
                colors={colors}
              />
            </Paint>
          </SkiaText>
        </Group>
      </Canvas>
    </Animated.View>
  );
}
