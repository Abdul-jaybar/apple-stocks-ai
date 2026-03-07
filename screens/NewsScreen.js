import React from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../styles/theme';
import { userProfile } from '../data/mockData';
import NewsFeed from '../components/NewsFeed';

export default function NewsScreen({ onShowToast }) {
    const { aiNewsItems } = require('../data/mockData');

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false} bounces>

            {/* Header */}
            <Text style={styles.screenTitle}>Business News</Text>

            {/* Personalized for Alex badge */}
            <View style={styles.personalizedContainer}>
                <View style={styles.personalizedBadge}>
                    <View style={styles.glowDot} />
                    <Text style={styles.personalizedText}>
                        ✦ Personalized for {userProfile.name}
                    </Text>
                </View>
                <Text style={styles.personalizedSub}>
                    Curated based on your holdings, strategy, and risk profile
                </Text>
            </View>

            {/* News */}
            <NewsFeed items={aiNewsItems} onShowToast={onShowToast} />

            <View style={{ height: 80 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollContent: { paddingTop: 12 },
    screenTitle: { ...typography.largeTitle, color: colors.textPrimary, paddingHorizontal: spacing.lg, marginBottom: spacing.md },
    personalizedContainer: {
        marginHorizontal: spacing.lg,
        marginBottom: spacing.lg,
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        backgroundColor: 'rgba(10, 132, 255, 0.06)',
        borderWidth: 1,
        borderColor: 'rgba(10, 132, 255, 0.15)',
    },
    personalizedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    glowDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#0A84FF',
        marginRight: spacing.sm,
        ...Platform.select({
            web: { boxShadow: '0 0 8px rgba(10, 132, 255, 0.6), 0 0 16px rgba(10, 132, 255, 0.3)' },
            default: {
                shadowColor: '#0A84FF',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 6,
            },
        }),
    },
    personalizedText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0A84FF',
        letterSpacing: 0.2,
    },
    personalizedSub: {
        ...typography.footnote,
        color: colors.textSecondary,
        lineHeight: 18,
    },
});
