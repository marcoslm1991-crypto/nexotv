import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { FocusableItem } from './FocusableItem';

export interface ChannelItem {
  id: string;
  number: number;
  name: string;
  category: string;
  epgTitle: string;
  epgTime: string;
}

interface ZappingOverlayProps {
  channels: ChannelItem[];
  currentChannelId: string;
  onSelectChannel: (channel: ChannelItem) => void;
  onClose: () => void;
}

export const ZappingOverlay: React.FC<ZappingOverlayProps> = ({
  channels,
  currentChannelId,
  onSelectChannel,
  onClose,
}) => {
  return (
    <View style={styles.overlayContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ZAPPING RÁPIDO - GUÍA DE CANALES</Text>
        <Text style={styles.headerSub}>Presioná arriba/abajo para navegar o pulsa Back para ocultar</Text>
      </View>

      <ScrollView style={styles.channelList}>
        {channels.map((ch, idx) => {
          const isSelected = ch.id === currentChannelId;
          return (
            <FocusableItem
              key={ch.id}
              hasTVPreferredFocus={idx === 0}
              style={[styles.channelRow, isSelected && styles.channelRowActive]}
              focusedStyle={styles.channelRowFocused}
              onPress={() => {
                onSelectChannel(ch);
                onClose();
              }}
            >
              <Text style={styles.chNumber}>{ch.number}</Text>
              <View style={styles.chDetails}>
                <Text style={styles.chName}>
                  {ch.name} {isSelected ? '🔴 EN VIVO' : ''}
                </Text>
                <Text style={styles.epgText}>
                  {ch.epgTime} - {ch.epgTitle}
                </Text>
              </View>
            </FocusableItem>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 320,
    backgroundColor: 'rgba(10, 10, 10, 0.88)',
    borderTopWidth: 2,
    borderTopColor: '#E50914',
    padding: 20,
  },
  header: {
    marginBottom: 12,
  },
  headerTitle: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  headerSub: {
    color: '#CCCCCC',
    fontSize: 13,
  },
  channelList: {
    flex: 1,
  },
  channelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 30, 30, 0.7)',
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
  channelRowActive: {
    backgroundColor: 'rgba(229, 9, 20, 0.3)',
    borderColor: '#E50914',
  },
  channelRowFocused: {
    backgroundColor: 'rgba(255, 215, 0, 0.25)',
    borderColor: '#FFD700',
  },
  chNumber: {
    color: '#FFD700',
    fontSize: 22,
    fontWeight: '900',
    width: 45,
    textAlign: 'center',
  },
  chDetails: {
    flex: 1,
    marginLeft: 12,
  },
  chName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  epgText: {
    color: '#AAAAAA',
    fontSize: 13,
    marginTop: 2,
  },
});
