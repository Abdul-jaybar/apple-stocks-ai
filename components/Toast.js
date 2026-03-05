import React, { useState, useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, View } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../styles/theme';

export default function Toast({ message, type = 'success', visible, onHide }) {
    const slideAnim = useRef(new Animated.Value(-100)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(slideAnim, {
                    toValue: 60,
                    useNativeDriver: true,
                    tension: 80,
                    friction: 12,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();

            const timer = setTimeout(() => {
                Animated.parallel([
                    Animated.timing(slideAnim, {
                        toValue: -100,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacityAnim, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ]).start(() => {
                    if (onHide) onHide();
                });
            }, 2500);

            return () => clearTimeout(timer);
        }
    }, [visible]);

    if (!visible) return null;

    const bgColor = type === 'success' ? colors.stockGreen
        : type === 'warning' ? '#FF9F0A'
            : type === 'info' ? colors.systemBlue
                : colors.stockRed;

    const icon = type === 'success' ? '✓'
        : type === 'warning' ? '⚠'
            : type === 'info' ? 'ℹ'
                : '✕';

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{ translateY: slideAnim }],
                    opacity: opacityAnim,
                    backgroundColor: bgColor,
                },
            ]}
        >
            <Text style={styles.icon}>{icon}</Text>
            <Text style={styles.message} numberOfLines={2}>{message}</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: spacing.lg,
        right: spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
        zIndex: 9999,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    icon: {
        fontSize: 18,
        color: '#FFFFFF',
        marginRight: spacing.sm,
        fontWeight: '700',
    },
    message: {
        ...typography.subheadline,
        color: '#FFFFFF',
        fontWeight: '600',
        flex: 1,
    },
});
