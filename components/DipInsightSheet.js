import React, { useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback,
    Modal, Animated, Dimensions, Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, borderRadius } from '../styles/theme';
import { dipInsights } from '../data/mockData';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = 320;

export default function DipInsightSheet({ visible, onClose, dipIndex }) {
    const slideAnim = useRef(new Animated.Value(SHEET_HEIGHT)).current;
    const backdropAnim = useRef(new Animated.Value(0)).current;

    // Find the matching insight
    const insight = dipInsights.find(d => d.dipIndex === dipIndex) || dipInsights[0];

    useEffect(() => {
        if (visible) {
            if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            Animated.parallel([
                Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 65, friction: 11 }),
                Animated.timing(backdropAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
            ]).start();
        }
    }, [visible]);

    const closeSheet = () => {
        Animated.parallel([
            Animated.timing(slideAnim, { toValue: SHEET_HEIGHT, duration: 250, useNativeDriver: true }),
            Animated.timing(backdropAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
        ]).start(() => onClose());
    };

    if (!visible) return null;

    const Wrapper = Platform.OS === 'web' ? View : Modal;
    const wrapperProps = Platform.OS === 'web'
        ? { style: styles.webModalOverlay }
        : { transparent: true, visible, animationType: 'none', statusBarTranslucent: true };

    return (
        <Wrapper {...wrapperProps}>
            <TouchableWithoutFeedback onPress={closeSheet}>
                <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]} />
            </TouchableWithoutFeedback>

            <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }], height: SHEET_HEIGHT }]}>
                <View style={styles.handleContainer}><View style={styles.handle} /></View>

                <View style={styles.content}>
                    {/* Verdict badge */}
                    <View style={styles.headerRow}>
                        <View style={[styles.verdictBadge, { backgroundColor: insight.aiColor + '20' }]}>
                            <View style={[styles.verdictDot, { backgroundColor: insight.aiColor }]} />
                            <Text style={[styles.verdictText, { color: insight.aiColor }]}>{insight.aiVerdict}</Text>
                        </View>
                        <Text style={styles.sparkle}>✦</Text>
                    </View>

                    {/* Headline */}
                    <Text style={styles.headline}>{insight.headline}</Text>
                    <Text style={styles.detail}>{insight.detail}</Text>

                    {/* AI recommendation */}
                    <View style={styles.recommendBox}>
                        <Text style={styles.recommendLabel}>AI Recommendation for Your Portfolio</Text>
                        <Text style={styles.recommendText}>{insight.relevance}</Text>
                    </View>

                    <TouchableOpacity activeOpacity={0.7} style={styles.dismissBtn} onPress={closeSheet}>
                        <Text style={styles.dismissText}>Got it</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </Wrapper>
    );
}

const styles = StyleSheet.create({
    backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
    webModalOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 1000 },
    sheet: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: colors.sheetBackground,
        borderTopLeftRadius: borderRadius.xl, borderTopRightRadius: borderRadius.xl,
        ...Platform.select({
            web: { boxShadow: '0px -4px 12px rgba(0,0,0,0.4)' },
            default: { shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 12 },
        }),
    },
    handleContainer: { alignItems: 'center', paddingTop: 10, paddingBottom: 6 },
    handle: { width: 36, height: 5, borderRadius: 3, backgroundColor: colors.textTertiary },
    content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
    verdictBadge: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.pill,
    },
    verdictDot: { width: 8, height: 8, borderRadius: 4, marginRight: spacing.xs },
    verdictText: { ...typography.caption1, fontWeight: '700' },
    sparkle: { fontSize: 18, color: colors.aiGlow },
    headline: { ...typography.headline, color: colors.textPrimary, marginBottom: spacing.xs, lineHeight: 22 },
    detail: { ...typography.subheadline, color: colors.textSecondary, lineHeight: 20, marginBottom: spacing.md },
    recommendBox: {
        backgroundColor: colors.aiGlowDim, borderRadius: borderRadius.md,
        padding: spacing.md, marginBottom: spacing.md, borderLeftWidth: 3, borderLeftColor: colors.aiGlow,
    },
    recommendLabel: { ...typography.caption2, color: colors.aiGlow, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing.xs },
    recommendText: { ...typography.subheadline, color: colors.textPrimary, lineHeight: 20 },
    dismissBtn: {
        backgroundColor: colors.cardBackgroundElevated, paddingVertical: spacing.md,
        borderRadius: borderRadius.md, alignItems: 'center', minHeight: 44,
    },
    dismissText: { ...typography.headline, color: colors.textPrimary },
});
