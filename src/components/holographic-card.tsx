import React, { useMemo } from "react";
import {
  Canvas,
  LinearGradient,
  Rect,
  Group,
  Mask,
  Circle,
  BlurMask,
  Skia,
  RoundedRect,
  Path,
  vec,
} from "@shopify/react-native-skia";
import type { SharedValue } from "react-native-reanimated";
import { Extrapolation, interpolate, useDerivedValue } from "react-native-reanimated";

interface HolographicCardProps {
  width: number;
  height: number;
  rotateY: SharedValue<number>;
  color?: string;
}

export const HolographicCard: React.FC<HolographicCardProps> = ({
  width,
  height,
  rotateY,
  color = "red",
}) => {
  const centerX = useDerivedValue(() => {
    const rot = rotateY.value % 360;
    return width / 2 + Math.sin((rot * Math.PI) / 180) * width * 0.4;
  });

  const opacity = useDerivedValue(() => {
    return interpolate(
      Math.abs(rotateY.value % 360),
      [0, 90, 180, 270, 360],
      [0, 0.6, 0.9, 0.6, 0],
      Extrapolation.CLAMP
    );
  });

  const dynamicGradient = useDerivedValue(() => {
    const rot = rotateY.value % 360;
    const offset = (rot / 360) * width;

    // Use `vec` to calculate the start and end for the gradient
    const start = vec(-offset, 0);
    const end = vec(width - offset, height);

    return { start, end };
  });

  const dotSize = 24;
  const gridH = Math.ceil(width / dotSize);
  const gridV = Math.ceil(height / dotSize);

  const gridPath = useMemo(() => {
    const path = Skia.Path.Make();
    for (let i = 0; i < gridH; i++) {
      for (let j = 0; j < gridV; j++) {
        const cx = i * dotSize + dotSize / 2;
        const cy = j * dotSize + dotSize / 2;
        path.addCircle(cx, cy, dotSize / 2);
      }
    }
    return path;
  }, [width, height]);

  const clipArea = useMemo(() => {
    const path = Skia.Path.Make();
    path.addCircle(width / 2, 0, dotSize);
    path.addCircle(width / 2, height, dotSize);
    return path;
  }, []);

  const electricLines = useMemo(() => {
    const path = Skia.Path.Make();
    for (let i = 0; i < 5; i++) {
      const p = Skia.Path.Make();
      const y = (height / 5) * i + height / 10;
      p.moveTo(0, y);
      for (let x = 0; x < width; x += 20) {
        const jitter = (Math.sin((x + i * 45) / 25) + Math.cos(x / 10)) * 8;
        p.lineTo(x, y + jitter);
      }
      path.addPath(p);
    }
    return path;
  }, [width, height]);

  return (
    <Canvas style={{ width, height, backgroundColor: "transparent" }}>
      {/* <Group clip={clipArea} invertClip> */}
        <RoundedRect x={0} y={0} width={width} height={height} color={color} r={5} />

        <Mask
          mode="luminance"
          mask={
            <Group>
              <Rect x={0} y={0} width={width} height={height} color="white" opacity={opacity} />
              <Circle
                cx={centerX}
                cy={height / 2}
                r={height / 2.2}
                color="black"
              >
                <BlurMask blur={200} style="normal" />
              </Circle>
            </Group>
          }
        >
          <Group>
            <Path path={gridPath}>
              <LinearGradient
                start={dynamicGradient.value.start} // Use dynamic gradient values here
                end={dynamicGradient.value.end} // Use dynamic gradient values here
                colors={[
                  "#003366",  // 深蓝色背景
                  "#4682B4",  // 天蓝色
                  "#FFB800",  // 深金色
                  "#2F4F4F",  // 暗灰色
                ]}
                positions={[0, 0.2, 0.6, 1]} 
              />
            </Path>

            {/* 电光流动线条 */}
            <Path path={electricLines}>
              <LinearGradient
                start={vec(0, 0)}
                end={vec(width, 0)}
                colors={["#FFFFFFAA", "#00FFFF88", "#1E90FF55"]}
              />
            </Path>
          </Group>
        </Mask>
      {/* </Group> */}
    </Canvas>
  );
};
