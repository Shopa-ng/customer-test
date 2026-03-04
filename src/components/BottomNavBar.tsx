import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';
import { NavigationProp } from '../types/navigation';

interface BottomNavBarProps {
  activeTab: 'Home' | 'Categories' | 'Cart' | 'Profile';
}

const tabs = [
  { name: 'Home', icon: 'home-outline' },
  { name: 'Categories', icon: 'grid-outline' },
  { name: 'Cart', icon: 'cart-outline' },
  { name: 'Profile', icon: 'person-outline' },
] as const;

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab }) => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 20);

  const handlePress = (tab: string) => {
    navigation.navigate(tab as any);
  };

  return (
    <View style={[styles.floatingWrapper, { bottom: bottomPad }]}>
      <View style={styles.pillShadow}>
        <View style={styles.pillContainer}>
          <BlurView
            intensity={100}
            tint="light"
            style={StyleSheet.absoluteFillObject}
          />
          <View style={[StyleSheet.absoluteFillObject, styles.whiteFill]} />
          <LinearGradient
            colors={[
              'rgba(180, 210, 255, 0.07)',
              'rgba(255, 255, 255, 0.00)',
              'rgba(255, 220, 180, 0.07)',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[StyleSheet.absoluteFillObject, { borderRadius: 48 }]}
            pointerEvents="none"
          />
          <View
            style={[StyleSheet.absoluteFillObject, styles.lightSheen]}
            pointerEvents="none"
          />

          {tabs.map((tab) => {
            const isActive = activeTab === tab.name;
            return (
              <TouchableOpacity
                key={tab.name}
                style={styles.tabItem}
                onPress={() => handlePress(tab.name)}
                activeOpacity={0.75}
              >
                {isActive && <View style={styles.activeBlob} />}
                <Ionicons
                  name={tab.icon as any}
                  size={22}
                  color={isActive ? COLORS.primary : COLORS.textPrimary}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    isActive ? styles.tabLabelActive : styles.tabLabelInactive,
                  ]}
                >
                  {tab.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingWrapper: {
    position: 'absolute',
    left: 24,
    right: 24,
  },
  pillShadow: {
    borderRadius: 48,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.07,
        shadowRadius: 1,
      },
      android: { elevation: 4 },
    }),
  },
  pillContainer: {
    flexDirection: 'row',
    borderRadius: 48,
    overflow: 'hidden',
    padding: 5,
  },
  whiteFill: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 48,
  },
  lightSheen: {
    borderRadius: 48,
    borderTopWidth: 1.5,
    borderLeftWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.95)',
    borderLeftColor: 'rgba(255,255,255,0.6)',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 999,
    position: 'relative',
  },
  activeBlob: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(210, 210, 210, 0.5)',
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  tabLabel: {
    marginTop: 3,
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  tabLabelActive: {
    color: COLORS.primary,
  },
  tabLabelInactive: {
    color: COLORS.textPrimary,
  },
});
