import React, {useCallback, useEffect, useState} from 'react';

import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {RootState} from '../redux/store';
import {collectReward, Reward} from '../redux/rewardsSlice';
import {fetchRewards} from '../api/rewardsApi';
import {RootStackParamList} from '../../App';

const RewardItem = React.memo(
  ({
    item,
    isCollected,
    onCollect,
    index,
  }: {
    item: Reward;
    isCollected: boolean;
    onCollect: () => void;
    index: number;
  }) => {
    const imageUrl = item.image || 'https://via.placeholder.com/60';
    return (
      <View style={[styles.itemContainer, isCollected && styles.collected]}>
        <View style={styles.row}>
          <Image source={{uri: imageUrl}} style={styles.image} />
          <View style={{flex: 1}}>
            <Text style={styles.title}>{item.name}</Text>
            <Text>
              {item.needed_points === 0
                ? 'Free'
                : `${item.needed_points} points`}
            </Text>

            {!isCollected && (
              <TouchableOpacity style={styles.button} onPress={onCollect}>
                <Text style={styles.buttonText}>Collect</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  },
);

export const AvailableRewardsScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const collected = useSelector((state: RootState) => state.rewards.collected);

  const [rewards, setRewards] = useState<Reward[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(true);

  const loadRewards = useCallback(async () => {
    console.log(`Loading rewards: page=${page}`);
    if (loading || !hasMore) return;
    try {
      setLoading(true);
      const data = await fetchRewards(page, 10);
      const newRewards = data.results.filter(
        (r: any) => r.pictures?.length || r.image,
      );
      setRewards(prev => [...prev, ...newRewards]);
      setHasMore(Boolean(data.next));
      setPage(p => p + 1);
    } catch (err) {
      setError('Failed to load rewards.');
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    loadRewards();
  }, []);

  const handleCollect = (reward: Reward) => {
    dispatch(collectReward(reward));
  };

  const isRewardCollected = (id: string) => collected.some(r => r.id === id);

  return (
    <SafeAreaView style={styles.safeArea}>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={rewards}
          keyExtractor={item => item.id}
          renderItem={({item, index}) => (
            <RewardItem
              item={item}
              isCollected={isRewardCollected(item.id)}
              onCollect={() => handleCollect(item)}
              index={index}
            />
          )}
          onEndReached={loadRewards}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading ? <ActivityIndicator /> : null}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Collected')}
        activeOpacity={0.8}
        accessibilityLabel="View Collected Rewards">
        <Text style={styles.fabIcon}>🎁</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 16,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    backgroundColor: '#007bff',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  fabIcon: {
    fontSize: 28,
    color: '#fff',
  },
  itemContainer: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
  },
  collected: {
    opacity: 0.4,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  button: {
    marginTop: 8,
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
  },
  error: {
    color: 'red',
    padding: 16,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
});
