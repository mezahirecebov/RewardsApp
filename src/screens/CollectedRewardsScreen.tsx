import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';

export const CollectedRewardsScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const collected = useSelector((state: RootState) => state.rewards.collected);

  return (
    <SafeAreaView style={styles.container}>
      {/* <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('Available')}>
        <Text style={styles.navButtonText}>← Back to Available Rewards</Text>
      </TouchableOpacity> */}

      <Text style={styles.header}>Collected Rewards</Text>

      {collected.length === 0 ? (
        <Text style={styles.emptyText}>No rewards collected yet.</Text>
      ) : (
        <FlatList
          data={collected}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View style={styles.rewardItem}>
              <Text style={styles.name}>{item.name}</Text>
              <Text>{item.needed_points} points</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  navButton: {
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  navButtonText: {
    color: '#007bff',
    fontWeight: '500',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
  rewardItem: {
    padding: 12,
    backgroundColor: '#e6ffe6',
    borderRadius: 8,
    marginBottom: 10,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
