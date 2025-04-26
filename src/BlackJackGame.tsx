import React, { useState } from "react";
import { View, Button, Image, Dimensions, TouchableOpacity, StyleSheet, Text } from "react-native";
import AnimatedCard from "./AnimatedCard";
import { cardImagesMap } from "./constants/cardImageMap";
import { Ticket } from "./components/ticket";
import { FrontSide } from "./components/ticket/front-side";
import { BackSide } from "./components/ticket/back-side";
import {
  Canvas,
  ImageShader,
  RadialGradient,
  Rect,
  SweepGradient,
  vec,
} from "@shopify/react-native-skia";
import { GradientButton } from "./components/GradientButton";
const backImage = require("../assets/cards/card_back.png");
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function BlackJackGame() {
  const [cards, setCards] = useState<any>([]);
  const num = [
    "ace",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "jack",
    "queen",
    "king",
  ];
  const colors = ["diamonds", "hearts", "spades", "clubs"];
  const points = { "ace": 1, jack: 10, queen: 10, king: 10, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10}
  const createDeck = () => {
    const deck = [];
    for (let rank of num) {
      for (let suit of colors) {
        deck.push({ 
          rank, 
          suit, 
          image: cardImagesMap[`${rank}_of_${suit}`], 
          point: points[rank as keyof typeof points] 
        });
      }
    }
    return deck;
  };
  const [deck, setDeck] = useState<any[]>(createDeck());
  // 创建标准牌堆

  const drawCard = (deck: any[]) => {
    const randomIndex = Math.floor(Math.random() * deck.length);
    return deck.splice(randomIndex, 1)[0];
  };

  const handleDeal = () => {
    const newDeck = [...deck];
    const playerCard1 = drawCard(newDeck);
    const dealerCard1 = drawCard(newDeck);
    const playerCard2 = drawCard(newDeck);
    const dealerCard2 = drawCard(newDeck);

    setDeck(newDeck);
    // 更新状态
    const newCards = [
      {
        key: 1,
        image: playerCard1.image,
        backImage: playerCard1.back,
        toX: SCREEN_WIDTH / 2 - 50 - 24 - 12,
        toY: SCREEN_HEIGHT / 2 - 150,
        delay: 1000,
      },
      {
        key: 2,
        image: dealerCard1.image,
        backImage: dealerCard1.back,
        toX: SCREEN_WIDTH / 2 - 50 - 24 - 12,
        toY: -SCREEN_HEIGHT / 2 + 150,
        delay: 2000,
      },
      {
        key: 3,
        image: playerCard2.image,
        backImage: playerCard2.back,
        toX: SCREEN_WIDTH / 2 - 50 - 12,
        toY: SCREEN_HEIGHT / 2 - 150,
        delay: 3000,
      },
    //   {
    //     key: 4,
    //     image: dealerCard2.image,
    //     backImage: dealerCard2.back,
    //     toX: SCREEN_WIDTH / 2 - 50 - 12,
    //     toY: -SCREEN_HEIGHT / 2 + 150,
    //     delay: 4000,
    //   },
    ];
    setCards(newCards);
  };
  return (
    <View style={{ flex: 1 }}>
      {/* Skia Background Layer */}
      <Canvas
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <Rect x={0} y={0} width={SCREEN_WIDTH} height={SCREEN_HEIGHT}>
          <SweepGradient
            c={vec(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2)}
            colors={[
              "rgb(0, 60, 40)", // 深赌桌绿
              "rgb(0, 80, 50)", // 暗翡翠绿
              "rgb(10, 100, 60)", // 赌桌主色
              "rgb(30, 120, 80)", // 带黄调的绿
              "rgb(50, 140, 90)", // 浅苔藓绿
              "rgb(30, 120, 80)", // 回落到黄绿色
              "rgb(10, 100, 60)", // 回到主色
              "rgb(0, 80, 50)", // 暗翡翠
              "rgb(0, 60, 40)", // 闭合循环
            ]}
            // 可选添加渐变位置控制
            positions={[0, 0.25, 0.4, 0.6, 0.8, 0.85, 0.9, 0.95, 1]}
          />
        </Rect>
      </Canvas>
      {/* <Canvas style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
  <Rect x={0} y={0} width={SCREEN_WIDTH} height={SCREEN_HEIGHT}>
    <RadialGradient
      c={vec(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2)}
      r={Math.max(SCREEN_WIDTH, SCREEN_HEIGHT) / 1.2}
      colors={[
        "rgb(0, 60, 40)",       // 深赌桌绿
        "rgb(0, 80, 50)",       // 暗翡翠绿
        "rgb(10, 100, 60)",     // 赌桌主色
        "rgb(30, 120, 80)",     // 带黄调的绿
        "rgb(50, 140, 90)",     // 浅苔藓绿
        "rgb(30, 120, 80)",     // 回落到黄绿色
        "rgb(10, 100, 60)",     // 回到主色
        "rgb(0, 80, 50)",       // 暗翡翠
        "rgb(0, 60, 40)"        // 闭合循环
      ]}
      // 可选添加渐变位置控制
      positions={[0, 0.25, 0.4, 0.6, 0.8, 0.85, 0.9, 0.95, 1]}
    />
  </Rect>
</Canvas> */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            zIndex: 10,
            position: "absolute",
            top: SCREEN_HEIGHT / 2 - 75,
            left: 24,
          }}
        >
          {cards.map(
            (card: {
              key: number;
              image: any;
              toX: number;
              toY: number;
              delay: number;
            }) => (
              <View key={card.key} style={{ zIndex: card.key * 100 }}>
                <Ticket
                  width={100}
                  height={150}
                  key={card.key}
                  image={card.image}
                  backImage={backImage}
                  toX={card.toX}
                  toY={card.toY}
                  delay={card.delay}
                />
              </View>
            )
          )}
        </View>
        <GradientButton title="Deal" onPress={() => {
            setCards([]);
            setTimeout(() => {
              handleDeal();
            }, 500);
          }} />
       
      </View>
    </View>
  );
}

  
  const styles = StyleSheet.create({
    button: {
    //   backgroundColor: 'linear-gradient(45deg, #FFD700, #C0B283)', // gold tone (you'll simulate it below)
      borderWidth: 2,
      borderColor: '#FFD700', // royal gold
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 12,
      marginVertical: 10,

      backgroundColor: '#0b3d2e', // elegant dark green background (rich casino vibe)
    },
    buttonText: {
      color: '#FFD700', // golden text
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });