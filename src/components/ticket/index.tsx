/**
 * A flippable ticket component that supports pan and tap gestures for rotation.
 * The ticket has two sides (front and back) and uses a holographic effect.
 */

import React, { useEffect } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withTiming,
  cancelAnimation,
  withDelay,
  Easing,
  withSequence,
} from "react-native-reanimated";
import { StyleSheet, View, Image } from "react-native";

import { HolographicCard } from "../holographic-card";

/**
 * Props for the Ticket component
 * @typedef {Object} TicketProps
 * @property {number} width - The width of the ticket
 * @property {number} height - The height of the ticket
 * @property {React.ReactNode} [frontSide] - Content to display on the front of the ticket
 * @property {React.ReactNode} [backSide] - Content to display on the back of the ticket
 */
type TicketProps = {
  image: any; // 传入卡牌的正面图片
  backImage: any; // 传入卡牌的背面图片
  toX: number;
  toY: number;
  delay: number;
  width: number;
  height: number;
  frontSide?: React.ReactNode;
  backSide?: React.ReactNode;
}

export const Ticket: React.FC<TicketProps> = React.memo(
  ({ image, backImage, toX, toY, delay, width, height}) => {
    // Shared values for tracking horizontal translation and gesture context
    const translateN = useSharedValue(0);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const contextX = useSharedValue(0);

    // Derived value for Y-axis rotation based on translation
    const rotateY = useDerivedValue(() => {
      return translateN.value % 360;
    });

    // Determine which side is currently visible
    const isFront = useDerivedValue(() => {
      const absRotate = Math.abs(rotateY.value);
      return absRotate < 90 || absRotate > 270;
    });

    // Animated styles for front and back visibility
    const rFrontStyle = useAnimatedStyle(() => {
      return {
        opacity: isFront.value ? 1 : 0,
        zIndex: isFront.value ? 1 : 0,
      };
    });

    const rBackStyle = useAnimatedStyle(() => {
      return {
        opacity: isFront.value ? 0 : 1,
        zIndex: isFront.value ? 0 : 1,
      };
    });

  
    useEffect(() => {
      translateX.value = withDelay(
        delay+200,
        withTiming(toX, {
          duration: 1000,
          easing: Easing.out(Easing.ease),
        })
      );
    
      translateY.value = withDelay(
        delay+200,
        withTiming(toY, {
          duration: 1000,
          easing: Easing.out(Easing.ease),
        })
      );
    
      translateN.value = withDelay(
        delay+1200, // wait for move to finish first
        withTiming(translateN.value + 180, {
          duration: 500,
        })
      );
    }, []);


    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { translateX: translateX.value },
          { translateY: translateY.value },
          { perspective: 1000 },
          { rotateY: `${rotateY.value}deg` },
        ],
      };
    });
    return (
      // <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            {
              position: 'absolute',
              width,
              height,
              overflow: "hidden",
            },
            animatedStyle,
          ]}
        >
          {/* Front side content */}
          <Animated.View style={[StyleSheet.absoluteFill, rFrontStyle]}>
            <Image
              source={backImage}
              style={{ height: "100%", width: "100%", borderRadius: 4 }}
            />
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width,
                height,
                opacity: 0.9, // 使全息效果半透明
              }}
              pointerEvents="none" // 让手势穿透这个发光层
            >
              <HolographicCard
                width={width}
                height={height}
                rotateY={rotateY}
                color="rgba(255,255,255,0.1)"
              />
            </View>
          </Animated.View>

          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                transform: [{ scaleX: -1 }],
              },
              rBackStyle,
            ]}
          >
            <Image
              source={image}
              style={{ height: "100%", width: "100%", borderRadius: 4 }}
            ></Image>
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width,
                height,
                opacity: 0.3, // 使全息效果半透明
              }}
              pointerEvents="none" // 让手势穿透这个发光层
            >
              <HolographicCard
                width={width}
                height={height}
                rotateY={rotateY}
                color="transparent"
              />
            </View>
          </Animated.View>
        </Animated.View>
      // </GestureDetector>
    );
  }
);
