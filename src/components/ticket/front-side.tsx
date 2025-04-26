import { View, StyleSheet } from "react-native";

interface FrontSideProps {
  children: React.ReactNode;
}

export const FrontSide: React.FC<FrontSideProps> = ({ children }) => {
  return (
    <View style={styles.container}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // 样式自己填
    backgroundColor: 'black'
  },
});