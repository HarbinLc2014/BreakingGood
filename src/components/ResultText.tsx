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
  
  export function ResultText({
    font,
    textString,
    animation = true,
  }: {
    font: any;
    textString: string;
    animation: boolean;
  }) {
    const scale = useSharedValue(1);
    const rotate = useSharedValue(0);
    const [textColor, setTextColor] = useState("#FFFFFF");
    const [colors, setColors] = useState([
        'red'
    ]);
    useEffect(() => {
      if (animation) {
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
      } 
    }, []);
  
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
              text={`Black Jack!`}
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
  