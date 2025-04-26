import { Canvas, Rect, LinearGradient, vec } from "@shopify/react-native-skia";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

export function GradientButton({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  const width = 100;
  const height = 50;

  return (
    <View
      style={{
        width,
        height,
        marginVertical: 10,
        shadowColor: "#FFD700",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.6,
        shadowRadius: 10,
        elevation: 10,
      }}
    >
      <Canvas
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <Rect x={0} y={0} width={width} height={height}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(width, height)}
            colors={[
              "#FFFACD", // 柠檬白
              "#FFE135", // 香蕉金
              "#FFD700", // 标准金
              "#FF8C00", // 深橘金
            ]}
          />
        </Rect>
      </Canvas>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={styles.touchableArea}
      >
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  touchableArea: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  buttonText: {
    color: "#4B3832", // 深咖啡色，显得豪华
    fontSize: 18,
    fontWeight: "bold",
  },
});
