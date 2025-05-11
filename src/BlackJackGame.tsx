import React, { useState } from "react";
import {
  View,
  Button,
  Image,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Text,
  Platform,
} from "react-native";
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
  Text as SkiaText,
  LinearGradient,
  matchFont,
  Fill,
  Paint,
} from "@shopify/react-native-skia";
import { GradientButton } from "./components/GradientButton";
import { ScoreBoard } from "./components/ScoreBoard";
import { RANKS, POINTSMAP, SUITS } from "./utils/const";
import GameModal from "./components/GameModal";
import { useInsurance } from "./hooks/useInsurance";
import BlackJackGlowText from "./components/BlackJackGlowText";
const backImage = require("../assets/cards/card_back.png");
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const fontFamily = Platform.select({ ios: "Helvetica", default: "serif" });
const fontStyle = {
  fontFamily,
  fontSize: 42,
  fontStyle: "italic" as const,
  fontWeight: "bold" as const,
} as const;
const font = matchFont(fontStyle);
const PLAYER_INITIAL_X = SCREEN_WIDTH / 2 - 50 - 24 - 12;
const PLAYER_INITIAL_Y = SCREEN_HEIGHT / 2 - 150;

export default function BlackJackGame() {
  const [cards, setCards] = useState<any>([]);
  const [playerHands, setPlayerHands] = useState<any>([]);
  const [dealerHands, setDealerHands] = useState<any>([]);
  const [playerPts, setPlayerPts] = useState<number>(0);
  const [dealerPts, setDealerPts] = useState<number>(0);
  const [dealerPtsVisible, setDealerPtsVisible] = useState<boolean>(false);
  const [gameStatus, setGameStatus] = useState<any>("waiting");
  const [deckNum, setDeckNum] = useState<number>(8);

  const [insuranceAccepted, setInsuranceAccepted] = useState(false);

  const playerCanDouble =
    playerHands.length === 2 &&
    !playerHands.some((e: any) => e.point === 1) &&
    (playerHands[0].point + playerHands[1].point === 9 ||
      playerHands[0].point + playerHands[1].point === 10 ||
      playerHands[0].point + playerHands[1].point === 11);
  const playerCanSplit =
    playerHands.length === 2 && playerHands[0].point === playerHands[1].point; // ** split ace logic
  const dealerHasAce = false;

  const { showInsuranceModal, handleAcceptInsurance, handleDeclineInsurance } =
    useInsurance({
      dealerHands,
      onAcceptInsurance: () => {
        console.log("Player bought insurance");
        // 这里处理扣除一半筹码逻辑
        setInsuranceAccepted(true);
      },
      onDeclineInsurance: () => {
        console.log("Player declined insurance");
        setInsuranceAccepted(false);
      },
    });
  const calculateTotalPoints = (hand: any[]) => {
    let total = 0;
    let aceCount = 0;

    for (const card of hand) {
      total += card.point;
      if (card.point === 1) aceCount += 1;
    }

    // 尽量将 Ace 转换为 11 分，只要不爆
    while (aceCount > 0 && total + 10 <= 21) {
      total += 10;
      aceCount--;
    }

    return total;
  };

  const createDeck = () => {
    const deck = [];
    for (let i = 0; i < deckNum; i++) {
      for (let rank of RANKS) {
        for (let suit of SUITS) {
          deck.push({
            rank,
            suit,
            image: cardImagesMap[`${rank}_of_${suit}`],
            point: POINTSMAP[rank as keyof typeof POINTSMAP],
          });
        }
      }
    }
    return deck;
  };
  const [deck, setDeck] = useState<any[]>(createDeck());
  // 创建标准牌堆

  const drawCard = (deck: any[]) => {
    const randomIndex = Math.floor(Math.random() * deck.length);
    return deck.splice(randomIndex, 1)[0];
    // return deck.shift()
  };

  const handleDeal = () => {
    setDealerPtsVisible(false);
    setGameStatus("initialDealing");
    const newDeck = [...deck];
    // const playerCard1 = newDeck[18];
    // const playerCard2 = newDeck[19];
    // const dealerCard1 = newDeck[1];

    const dealerCard1 = drawCard(newDeck);
    const playerCard1 = drawCard(newDeck);
    const playerCard2 = drawCard(newDeck);
    const newPlayerHands = [playerCard1, playerCard2];
    setPlayerHands([playerCard1, playerCard2]);
    setDealerHands([dealerCard1]);
    setPlayerPts(calculateTotalPoints(newPlayerHands));
    setDealerPts(dealerCard1.point);
    setDeck(newDeck);
    // 更新状态
    const newCards = [
      {
        key: 1,
        image: playerCard1.image,
        backImage: playerCard1.back,
        toX: PLAYER_INITIAL_X,
        toY: PLAYER_INITIAL_Y,
        delay: 1000,
      },
      {
        key: 2,
        image: dealerCard1.image,
        backImage: dealerCard1.back,
        toX: PLAYER_INITIAL_X,
        toY: -PLAYER_INITIAL_Y,
        delay: 2000,
      },
      {
        key: 3,
        image: playerCard2.image,
        backImage: playerCard2.back,
        toX: PLAYER_INITIAL_X + 24,
        toY: PLAYER_INITIAL_Y,
        delay: 3000,
      },
    ];
    setCards(newCards);

    setTimeout(() => {
      // setState和setTimeout在一个context使用的时候 需要注意setState是异步更新，不能直接从state里面拿值放在timeout里执行
      const playerIsBlackJack =
        newPlayerHands.length === 2 &&
        newPlayerHands.some((e: any) => e.point === 10) &&
        newPlayerHands.some((e: any) => e.point === 1);
      if (playerIsBlackJack) {
        finalizeGame({ type: "blackJack" });
      } else if (dealerHasAce) {
        // show Insurance Modal
      } else {
        console.log("????");
        setGameStatus("playing");
      }
    }, 4500);
  };

  const finalizeGame = (data: any) => {
    if (data.type === "blackJack") {
      // if(dealerHasAce) {askEvenMoney()}
      // if dealerHasTen hitDealer, if not blackJack then finalize it
      setGameStatus("pending");
    }
  };

  const hitPlayer = (pts: number, double: boolean = false) => {
    setGameStatus("dealing");
    const hands = playerHands;
    const newDeck = [...deck];
    const newPlayerCard = drawCard(newDeck);
    const currentPts = calculateTotalPoints([...hands, newPlayerCard]);
    setPlayerHands((prev: any) => [...prev, newPlayerCard]);
    setDeck(newDeck);
    const newCard = {
      key: playerHands.length + 2,
      image: newPlayerCard.image,
      backImage: newPlayerCard.back,
      toX: PLAYER_INITIAL_X + 24 * playerHands.length,
      toY: PLAYER_INITIAL_Y,
      delay: 1,
      horizontalPlaced: double,
    };
    setCards((prev: any) => [...prev, newCard]);

    if (currentPts < 21 && !double) {
      setTimeout(() => {
        setPlayerPts(currentPts);
      }, 1500);
      setTimeout(() => {
        setGameStatus("playing");
      }, 1800);
    } else if (double) {
      setTimeout(() => {
        setPlayerPts(currentPts);
      }, 1500);
      setTimeout(() => {
        setDealerPtsVisible(true);
        hitDealer();
      }, 1800);
    } else {
      setTimeout(() => {
        setPlayerPts(currentPts);
      }, 1500);
      setTimeout(() => {
        setGameStatus("pending");
      }, 1800);
    }
  };

  const hitDealer = (length: any = 1, updateHands: any = null) => {
    setGameStatus("dealing");
    const newDeck = [...deck];
    const newDealerCard = drawCard(newDeck);
    const newHands = [...(updateHands || dealerHands), newDealerCard]; // 用它来算点数

    setDealerHands(newHands); // 这个是异步的，不可依赖

    setDeck(newDeck);
    const newCard = {
      key: playerHands.length + length + 2,
      image: newDealerCard.image,
      backImage: newDealerCard.back,
      toX: PLAYER_INITIAL_X + 24 * length,
      toY: -PLAYER_INITIAL_Y,
      delay: 1,
    };
    setCards((prev: any) => [...prev, newCard]);
    const newPts = calculateTotalPoints(newHands);
    setTimeout(() => {
      setDealerPts(newPts); // 正确更新庄家点数
    }, 800);

    const rawPoint = newHands.reduce((sum, card) => sum + card.point, 0);
    if (newPts < 17 || (newPts === 17 && rawPoint === 7)) {
      console.log("KEEP HITTING", newHands, newPts);
      setTimeout(() => {
        hitDealer(length + 1, newHands); // ❗递归传进去新的总点数！
      }, 1300);
    } else {
      console.log("STOPPED", newHands, newPts);
      setTimeout(() => {
        setGameStatus("pending");
      }, 1500);
    }
  };

  const renderButtons = () => {
    console.log("GAME STATUS", gameStatus);
    if (gameStatus === "playing") {
      return (
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              width: "100%",
            }}
          >
            <GradientButton title="Hit" onPress={() => hitPlayer(playerPts)} />
            <GradientButton
              title="Stand"
              onPress={() => {
                setDealerPtsVisible(true);
                hitDealer();
              }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              width: "100%",
            }}
          >
            {playerCanDouble && (
              <GradientButton
                title="Double"
                onPress={() => hitPlayer(playerPts, true)}
              />
            )}
            {playerCanSplit && (
              <GradientButton
                title="Split"
                onPress={() => {
                  setDealerPtsVisible(true);
                  hitDealer();
                }}
              />
            )}
          </View>
        </View>
      );
    }
    return (
      gameStatus !== "dealing" &&
      gameStatus !== "initialDealing" && (
        <GradientButton
          title="Start"
          onPress={() => {
            setCards([]);
            setTimeout(() => {
              handleDeal();
            }, 10);
          }}
        />
      )
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Skia Background Layer */}
      <GameModal
        visible={showInsuranceModal}
        onAccept={handleAcceptInsurance}
        onDecline={handleDeclineInsurance}
        playerIsBlackJack={
          playerHands.length === 2 &&
          playerHands.some((e: any) => e.point === 10) &&
          playerHands.some((e: any) => e.point === 1)
        }
      />
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
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* <BlackJackGlowText /> */}
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
              horizontalPlaced: boolean;
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
                  horizontalPlaced={card.horizontalPlaced}
                />
              </View>
            )
          )}
        </View>
        {dealerPtsVisible && font ? (
          <ScoreBoard
            font={font}
            playerPts={dealerPts}
            type="Dealer"
            animation={false}
          ></ScoreBoard>
        ) : (
          <View style={{ width: 1, height: 50 }}></View>
        )}
        <View
          style={{
            marginVertical: 75,
            height: 50,
            width: 300,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {renderButtons()}
        </View>
        {gameStatus !== "initialDealing" &&
          gameStatus !== "waiting" &&
          font && (
            <ScoreBoard
              font={font}
              playerPts={playerPts}
              type="You"
              animation={true}
            ></ScoreBoard>
          )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    //   backgroundColor: 'linear-gradient(45deg, #FFD700, #C0B283)', // gold tone (you'll simulate it below)
    borderWidth: 2,
    borderColor: "#FFD700", // royal gold
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginVertical: 10,

    backgroundColor: "#0b3d2e", // elegant dark green background (rich casino vibe)
  },
  buttonText: {
    color: "#FFD700", // golden text
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
