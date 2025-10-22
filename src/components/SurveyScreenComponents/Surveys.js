import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';
import LottieView from 'lottie-react-native'; 

const Surveys = ({ surveys, setSurveys }) => {
  const uid = useSelector(state => state.username.uid);
  const currentUsername = useSelector(state => state.username.savedUsername);
  const roomCode = useSelector(state => state.room.currentRoom?.code);

  const handleVote = async (surveyId, optionIndex) => {
    try {
      const surveyRef = firestore()
        .collection('rooms')
        .doc(roomCode)
        .collection('surveys')
        .doc(surveyId);

      const snapshot = await surveyRef.get();
      if (!snapshot.exists) return;

      const surveyData = snapshot.data();
      const now = new Date();
      const expiryDate = parseExpiryDate(surveyData.expiry);
      if (expiryDate < now) {
        Alert.alert('Uyarı', 'Bu anketin süresi dolmuş');
        return;
      }

      const votedUsers = surveyData.votedUsers || {};
      const previousVoteIndex = votedUsers[uid];
      const newVotes = [...(surveyData.votes || [])];

      if (previousVoteIndex !== undefined && previousVoteIndex !== null) {
        newVotes[previousVoteIndex] = Math.max(0, (newVotes[previousVoteIndex] || 0) - 1);
      }

      newVotes[optionIndex] = (newVotes[optionIndex] || 0) + 1;

      const updateObj = {
        votes: newVotes,
        [`votedUsers.${uid}`]: optionIndex, 
      };

      await surveyRef.update(updateObj);
    } catch (error) {
      console.error('Oy verme hatası:', error);
      Alert.alert('Hata', 'Oy kaydedilirken bir hata oluştu');
    }
  };

  const handleDeleteSurvey = async (surveyId) => {
    Alert.alert(
      'Anketi Sil',
      'Bu anketi silmek istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await firestore()
                .collection('rooms')
                .doc(roomCode)
                .collection('surveys')
                .doc(surveyId)
                .delete();
              setSurveys(prev => prev.filter(s => s.id !== surveyId));
            } catch (error) {
              console.error('Anket silme hatası:', error);
              Alert.alert('Hata', 'Anket silinirken bir hata oluştu');
            }
          },
        },
      ]
    );
  };

  const parseExpiryDate = (expiryStr) => {
    if (!expiryStr) return new Date(0);
    const [datePart, timePart] = expiryStr.split(' ');
    if (!datePart || !timePart) return new Date(0);
    const [year, month, day] = datePart.split('-').map(Number);
    const [hour, minute] = timePart.split('.').map(Number);
    return new Date(year, month - 1, day, hour, minute);
  };

  const formatExpiry = expiryValue => {
    if (!expiryValue) return '';
    const dateObj = parseExpiryDate(expiryValue);
    if (isNaN(dateObj.getTime())) return expiryValue;
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} - ${hours}:${minutes}`;
  };

  if (!surveys || surveys.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <LottieView
          source={require('../../assets/animations/survey.json')}
          loop
          style={{ width: 260, height: 260 }}
        />
        <Text style={styles.emptyText}>Henüz hiç anket yok</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 10 }}>
      {surveys.map(survey => {
        const optionsArray = Array.isArray(survey.options)
          ? survey.options.map((text, index) => ({
              index,
              text,
              votedUsers: survey.votedUsers
                ? Object.keys(survey.votedUsers).filter(userId => survey.votedUsers[userId] === index)
                : [],
            }))
          : [];

        if (optionsArray.length === 0) return null;

        const now = new Date();
        const expiryDate = parseExpiryDate(survey.expiry);
        const isExpired = expiryDate < now;
        const totalVotes = survey.votes?.reduce((a, b) => a + b, 0) || 0;

        return (
          <View key={survey.id} style={styles.surveyCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.question}>{survey.question}</Text>
              <Text style={styles.expiryText}>{formatExpiry(survey.expiry)}</Text>
            </View>

            {optionsArray.map(option => {
              const voteCount = survey.votes?.[option.index] || 0;
              const percent = totalVotes ? ((voteCount / totalVotes) * 100).toFixed(0) : 0;
              const isVoted = option.votedUsers.includes(uid);
              const buttonStyle = isExpired
                ? styles.expiredOption
                : isVoted
                ? styles.voted
                : styles.notVoted;
              const textColor = isExpired ? '#888' : isVoted ? 'white' : '#f48022';

              return (
                <TouchableOpacity
                  key={`${survey.id}-${option.index}`}
                  disabled={isExpired}
                  style={[styles.optionButton, buttonStyle]}
                  onPress={() => handleVote(survey.id, option.index)}
                >
                  <Text style={[styles.optionText, { color: textColor }]}>{option.text}</Text>
                  <Text style={[styles.percentText, { color: textColor }]}>{percent}%</Text>
                </TouchableOpacity>
              );
            })}

            {survey.createdBy === currentUsername && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteSurvey(survey.id)}
              >
                <Text style={styles.deleteText}>×</Text>
              </TouchableOpacity>
            )}

            {isExpired && <Text style={styles.expired}>Bu anket sona erdi</Text>}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  surveyCard: {
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  expiryText: {
    fontSize: 12,
    color: 'gray',
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
    borderWidth: 2,
  },
  voted: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  notVoted: {
    backgroundColor: 'white',
    borderColor: '#f48022',
  },
  expiredOption: {
    backgroundColor: '#ccc',
    borderColor: '#999',
  },
  optionText: {
    fontWeight: 'bold',
  },
  percentText: {
    fontWeight: 'bold',
  },
  expired: {
    marginTop: 8,
    color: '#f48022',
    fontStyle: 'italic',
  },
  deleteButton: {
    position: 'absolute',
    right: -1,
    bottom: 2,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    color: '#f48022',
    fontSize: 22,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 150,
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
    marginTop: 10,
  },
});

export default Surveys;
