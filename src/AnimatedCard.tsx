import React from 'react';
import { Image, StyleSheet } from 'react-native';
import Animated, { Easing, withTiming, useSharedValue, useAnimatedStyle, withDelay } from 'react-native-reanimated';

interface AnimatedCardProps {
    key: number;
  image: any; // 传入卡牌的正面图片
  backImage: any; // 传入卡牌的背面图片
  toX: number;
  toY: number;
  delay: number;
  onFinish?: () => void;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ key, image, backImage, toX, toY, delay, onFinish }) => {
  // 动画值
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotateY = useSharedValue(0); // 翻转效果
  const isFlipped = useSharedValue(false); // 标记卡牌是否翻转

  // 发牌和翻牌的动画
  React.useEffect(() => {
    translateX.value = withDelay(
      delay,
      withTiming(toX, {
        duration: 300,
        easing: Easing.out(Easing.ease),
      })
    );
    translateY.value = withDelay(
      delay,
      withTiming(toY, {
        duration: 300,
        easing: Easing.out(Easing.ease),
      })
    );

    // 翻转动画，卡牌从背面翻到正面
    rotateY.value = withDelay(
      delay,
      withTiming(180, {
        duration: 300,
        easing: Easing.ease,
      })
    );

    // 动画完成后回调
    setTimeout(() => {
      isFlipped.value = true; // 设置卡牌翻转完成
      if (onFinish) onFinish();
    }, 1000);
  }, [toX, toY, delay, rotateY]);

  // 动画样式
  const animatedStyle = useAnimatedStyle(() => {
    const rotateYInterpolation = rotateY.value < 90 ? 0 : Math.PI; // 翻转的角度
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotateY: `${rotateYInterpolation}rad` }, // 设置旋转角度
      ],
    };
  });

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <Image
        source={isFlipped.value ? image : backImage} // 显示正面或背面
        style={styles.cardImage}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: 100,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backfaceVisibility: 'hidden', // 确保卡背不显示
  },
});

export default AnimatedCard;
