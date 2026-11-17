import 'package:flutter/material.dart';

import '../../app/brand_tokens.dart';

class LoadingState extends StatelessWidget {
  const LoadingState({super.key, this.message = 'Loading'});

  final String message;

  @override
  Widget build(BuildContext context) => Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const CircularProgressIndicator(),
            const SizedBox(height: BrandTokens.spaceMedium),
            Text(message, textAlign: TextAlign.center),
          ],
        ),
      );
}

class EmptyState extends StatelessWidget {
  const EmptyState({required this.message, super.key});

  final String message;

  @override
  Widget build(BuildContext context) => Center(
        child: Padding(
          padding: const EdgeInsets.all(BrandTokens.spaceLarge),
          child: Text(message, textAlign: TextAlign.center),
        ),
      );
}

class OfflineState extends StatelessWidget {
  const OfflineState({required this.message, this.onRetry, super.key});

  final String message;
  final VoidCallback? onRetry;

  @override
  Widget build(BuildContext context) => _MessageWithRetry(
        icon: Icons.cloud_off_outlined,
        message: message,
        onRetry: onRetry,
      );
}

class ErrorState extends StatelessWidget {
  const ErrorState({required this.message, this.onRetry, super.key});

  final String message;
  final VoidCallback? onRetry;

  @override
  Widget build(BuildContext context) => _MessageWithRetry(
        icon: Icons.error_outline,
        message: message,
        onRetry: onRetry,
      );
}

class RetryButton extends StatelessWidget {
  const RetryButton({required this.onPressed, super.key});

  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) => FilledButton.icon(
        onPressed: onPressed,
        icon: const Icon(Icons.refresh),
        label: const Text('Try again'),
        style: FilledButton.styleFrom(
          minimumSize: const Size(BrandTokens.minimumTapTarget, BrandTokens.minimumTapTarget),
        ),
      );
}

class _MessageWithRetry extends StatelessWidget {
  const _MessageWithRetry({required this.icon, required this.message, this.onRetry});

  final IconData icon;
  final String message;
  final VoidCallback? onRetry;

  @override
  Widget build(BuildContext context) => Center(
        child: Padding(
          padding: const EdgeInsets.all(BrandTokens.spaceLarge),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(icon),
              const SizedBox(height: BrandTokens.spaceMedium),
              Text(message, textAlign: TextAlign.center),
              if (onRetry != null) ...[
                const SizedBox(height: BrandTokens.spaceMedium),
                RetryButton(onPressed: onRetry!),
              ],
            ],
          ),
        ),
      );
}
