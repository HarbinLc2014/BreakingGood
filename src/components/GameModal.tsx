import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const GameModal = ({
  playerIsBlackJack,
  visible,
  onAccept,
  onDecline,
}: {
  playerIsBlackJack: boolean;
  visible: boolean;
  onAccept: () => void;
  onDecline: () => void;
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.message}>
            {playerIsBlackJack
              ? 'Do you want Even Money?'
              : 'Dealer has an Ace.\nBuy Insurance?'}
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onAccept} style={[styles.button, styles.buttonYes]}>
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onDecline} style={[styles.button, styles.buttonNo]}>
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default GameModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#0009',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#003300cc', // 深绿色玻璃感
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: 'gold',
    width: 300,
    shadowColor: '#FFD700',
    shadowOpacity: 0.9,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  message: {
    color: 'gold',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 8,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'gold',
    alignItems: 'center',
  },
  buttonYes: {
    backgroundColor: '#228B22', // forest green
  },
  buttonNo: {
    backgroundColor: '#8B0000', // dark red
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});
