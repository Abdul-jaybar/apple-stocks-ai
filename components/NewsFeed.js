import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../styles/theme';

function NewsCard({ item, onPress }) {
    return (
        <TouchableOpacity activeOpacity={0.6} style={styles.card} onPress={() => onPress && onPress(item)}>
            <View style={styles.cardContent}>
                <View style={styles.sourceRow}>
                    <View style={styles.sourceLeft}>
                        <Text style={styles.sourceName}>{item.source}</Text>
                    </View>
                    <Text style={styles.timestamp}>{item.timestamp}</Text>
                </View>
                <Text style={styles.headline}>{item.headline}</Text>
                <Text style={styles.summary} numberOfLines={3}>{item.summary}</Text>
                {item.tag && (
                    <View style={styles.tagRow}>
                        <View style={styles.tag}>
                            <Text style={styles.tagText}>{item.tag}</Text>
                        </View>
                    </View>
                )}
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
                <Text style={styles.sectionTitle}>Business News</Text>
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
    sectionTitle: { ...typography.title2, color: colors.textPrimary },
    headerSeparator: { height: StyleSheet.hairlineWidth, backgroundColor: colors.separator, marginHorizontal: spacing.lg, marginBottom: spacing.xs },
    card: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
    cardContent: { flex: 1 },
    sourceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
    sourceLeft: { flexDirection: 'row', alignItems: 'center' },
    sourceName: { ...typography.caption1, color: colors.textSecondary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
    timestamp: { ...typography.caption1, color: colors.textTertiary },
    headline: { ...typography.headline, color: colors.textPrimary, marginBottom: spacing.xs, lineHeight: 22 },
    summary: { ...typography.subheadline, color: colors.textSecondary, lineHeight: 20, marginBottom: spacing.sm },
    tagRow: { flexDirection: 'row', alignItems: 'center' },
    tag: { paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: borderRadius.sm, backgroundColor: colors.cardBackground },
    tagText: { ...typography.caption2, color: colors.textSecondary, fontWeight: '600' },
    separator: { height: StyleSheet.hairlineWidth, backgroundColor: colors.separator, marginLeft: spacing.lg },
});
