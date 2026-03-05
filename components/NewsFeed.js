import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../styles/theme';

function NewsCard({ item, onPress }) {
    return (
        <TouchableOpacity activeOpacity={0.6} style={styles.card} onPress={() => onPress && onPress(item)}>
            <View style={styles.cardContent}>
                <View style={styles.sourceRow}>
                    <View style={styles.sourceLeft}>
                        <Text style={[styles.sourceIcon, item.isAI && styles.sourceIconAI]}>{item.sourceIcon}</Text>
                        <Text style={[styles.sourceName, item.isAI && styles.sourceNameAI]}>{item.source}</Text>
                    </View>
                    <Text style={styles.timestamp}>{item.timestamp}</Text>
                </View>
                <Text style={styles.headline}>{item.headline}</Text>
                <Text style={styles.summary} numberOfLines={3}>{item.summary}</Text>
                <View style={styles.tagRow}>
                    <View style={[styles.tag, item.isAI ? styles.tagAI : styles.tagDefault]}>
                        <Text style={[styles.tagText, item.isAI && styles.tagTextAI]}>{item.tag}</Text>
                    </View>
                    {item.relevanceScore && <Text style={styles.relevanceText}>{item.relevanceScore}% relevant</Text>}
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default function NewsFeed({ items, onShowToast }) {
    const handlePress = (item) => {
        if (onShowToast) onShowToast(`Reading: ${item.headline}`, 'info');
    };

    return (
        <View style={styles.container}>
            <View style={styles.sectionHeader}>
                <View style={styles.headerLeft}>
                    <Text style={styles.sectionTitle}>AI Filtered Insights</Text>
                    <View style={styles.aiBadge}><Text style={styles.aiBadgeText}>✦ AI</Text></View>
                </View>
            </View>
            <View style={styles.headerSeparator} />
            {items.map((item, index) => (
                <React.Fragment key={item.id}>
                    <NewsCard item={item} onPress={handlePress} />
                    {index < items.length - 1 && <View style={styles.separator} />}
                </React.Fragment>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { paddingTop: spacing.xl },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, marginBottom: spacing.md },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    sectionTitle: { ...typography.title2, color: colors.textPrimary },
    aiBadge: { backgroundColor: colors.aiGlowDim, paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: borderRadius.pill, marginLeft: spacing.sm },
    aiBadgeText: { ...typography.caption2, color: colors.aiGlow, fontWeight: '700' },
    headerSeparator: { height: StyleSheet.hairlineWidth, backgroundColor: colors.separator, marginHorizontal: spacing.lg, marginBottom: spacing.xs },
    card: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
    cardContent: { flex: 1 },
    sourceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
    sourceLeft: { flexDirection: 'row', alignItems: 'center' },
    sourceIcon: { fontSize: 10, color: colors.textSecondary, marginRight: spacing.xs },
    sourceIconAI: { color: colors.aiGlow, fontSize: 12 },
    sourceName: { ...typography.caption1, color: colors.textSecondary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
    sourceNameAI: { color: colors.aiGlow },
    timestamp: { ...typography.caption1, color: colors.textTertiary },
    headline: { ...typography.headline, color: colors.textPrimary, marginBottom: spacing.xs, lineHeight: 22 },
    summary: { ...typography.subheadline, color: colors.textSecondary, lineHeight: 20, marginBottom: spacing.sm },
    tagRow: { flexDirection: 'row', alignItems: 'center' },
    tag: { paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: borderRadius.sm, marginRight: spacing.sm },
    tagDefault: { backgroundColor: colors.cardBackground },
    tagAI: { backgroundColor: colors.aiGlowDim },
    tagText: { ...typography.caption2, color: colors.textSecondary, fontWeight: '600' },
    tagTextAI: { color: colors.aiGlow },
    relevanceText: { ...typography.caption2, color: colors.textTertiary },
    separator: { height: StyleSheet.hairlineWidth, backgroundColor: colors.separator, marginLeft: spacing.lg },
});
