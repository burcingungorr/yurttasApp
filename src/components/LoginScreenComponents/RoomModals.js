import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  Dimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { createRoom, joinRoom } from "../../redux/roomSlice";
import firestore from "@react-native-firebase/firestore";
import InputUsername from "./InputUsername";
import { saveUsername } from "../../redux/usernameSlice";

const generateRoomCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const { height } = Dimensions.get("window");

const RoomModals = ({ setIsLoggedIn }) => {
  const dispatch = useDispatch();
  const username = useSelector((state) => state.username.savedUsername);

  const [localUsername, setLocalUsername] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [newRoomName, setNewRoomName] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");

  const [selectModalVisible, setSelectModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [codeModalVisible, setCodeModalVisible] = useState(false);

  const getOrCreateUser = async (finalUsername) => {
    const userSnapshot = await firestore()
      .collection("users")
      .where("name", "==", finalUsername)
      .get();

    if (userSnapshot.empty) {
      return await dispatch(saveUsername(finalUsername)).unwrap();
    } else {
      const existingUser = userSnapshot.docs[0].data();
      dispatch({
        type: saveUsername.fulfilled.type,
        payload: { uid: existingUser.uid, name: existingUser.name },
      });
      return { uid: existingUser.uid, name: existingUser.name };
    }
  };

  const handleJoinRoom = async () => {
    try {
      const finalUsername = username || localUsername.trim();
      if (!finalUsername) {
        Alert.alert("Hata", "Lütfen kullanıcı adınızı giriniz.");
        return;
      }

      const savedUser = await getOrCreateUser(finalUsername);

      await dispatch(
        joinRoom({ code: roomCode, username: savedUser.name })
      ).unwrap();

      const roomRef = firestore().collection("rooms").doc(roomCode);

      const matesSnapshot = await roomRef
        .collection("roommates")
        .where("username", "==", savedUser.name)
        .get();

      if (matesSnapshot.empty) {
        await roomRef.collection("roommates").add({
          username: savedUser.name,
          joinedAt: firestore.FieldValue.serverTimestamp(),
        });
      }

      setIsLoggedIn(true);
      setSelectModalVisible(false);
    } catch (err) {
      console.error("Odaya katılırken hata:", err);
      Alert.alert("Hata", "Odaya katılamadın.");
    }
  };

  const handleCreateRoom = async () => {
    try {
      const finalUsername = username || localUsername.trim();
      if (!finalUsername) {
        Alert.alert("Hata", "Lütfen kullanıcı adınızı giriniz.");
        return;
      }

      const savedUser = await getOrCreateUser(finalUsername);

      const code = generateRoomCode();

      await dispatch(createRoom({ name: newRoomName, code })).unwrap();

      setGeneratedCode(code);
      setCreateModalVisible(false);
      setCodeModalVisible(true);
      setNewRoomName("");
      setIsLoggedIn(true);
    } catch (err) {
      console.error("Oda oluşturulurken hata:", err);
      Alert.alert("Hata", err?.message || "Oda oluşturulamadı.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setSelectModalVisible(true)}
      >
        <Text style={styles.buttonText}>Odaya Gir</Text>
      </TouchableOpacity>

      <Text style={{ marginVertical: 15 }}>VEYA</Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#fa8d34ff" }]}
        onPress={() => setCreateModalVisible(true)}
      >
        <Text style={styles.buttonText}>Oda Kur</Text>
      </TouchableOpacity>

      {/* Join Room Modal */}
      <Modal visible={selectModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Odaya Katıl</Text>

            <InputUsername username={localUsername} setUsername={setLocalUsername} />

            <TextInput
              placeholder="Oda kodunu giriniz"
              keyboardType="number-pad"
              value={roomCode}
              onChangeText={setRoomCode}
              style={styles.input}
            />

            <TouchableOpacity style={styles.modalButton} onPress={handleJoinRoom}>
              <Text style={styles.modalButtonText}>Katıl</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Create Room Modal */}
      <Modal visible={createModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setCreateModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Yeni Oda Oluştur</Text>

            <TextInput
              placeholder="Oda adını belirleyin"
              value={newRoomName}
              onChangeText={setNewRoomName}
              style={styles.input}
            />

            <InputUsername username={localUsername} setUsername={setLocalUsername} />

            <TouchableOpacity
              style={[
                styles.modalButton,
                { opacity: newRoomName.trim() ? 1 : 0.5 },
              ]}
              disabled={!newRoomName.trim()}
              onPress={handleCreateRoom}
            >
              <Text style={styles.modalButtonText}>Kur</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Room Code Modal */}
      <Modal visible={codeModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setCodeModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Odanız Kuruldu!</Text>
            <Text style={styles.roomCode}>{generatedCode}</Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setCodeModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Tamam</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default RoomModals;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: height * 0.05,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: "45%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    position: "relative",
    marginTop: 150,
  },
  closeButton: { position: "absolute", top: 10, right: 10, zIndex: 1 },
  closeButtonText: { fontSize: 26, color: "#333" },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 14,
    textAlign: "center",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  modalButtonText: { color: "white", fontSize: 16 },
  roomCode: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
  },
});
