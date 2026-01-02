import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, AdMobBannerSize, InterstitialAdPluginEvents, AdLoadInfo } from '@capacitor-community/admob';

/**
 * Google AdMob Service for Taskflow
 * Play Store Compliant | User-Friendly | Non-Intrusive
 * 
 * Rules:
 * - Banners at bottom of screens (non-scrolling)
 * - Interstitials ONLY at safe points (after completing tasks, after creating task)
 * - Max 1 interstitial per 2 minutes (cooldown)
 * - Never block critical UI
 * - Graceful fallback if ads fail
 */

// ============ AD UNIT IDS ============
const AD_CONFIG = {
  appId: 'ca-app-pub-5873409630093104~5205844113',
  
  // Production IDs
  bannerUnitId: 'ca-app-pub-5873409630093104/7391177845',
  interstitialUnitId: 'ca-app-pub-5873409630093104/3567482904',
  
  // Test IDs (use during development)
  testBannerUnitId: 'ca-app-pub-3940256099942544/6300978111',
  testInterstitialUnitId: 'ca-app-pub-3940256099942544/1033173712',
};

// Determine environment
const IS_DEVELOPMENT = import.meta.env.DEV;

class AdMobServiceClass {
  private initialized = false;
  private bannerVisible = false;
  private lastInterstitialTime = 0;
  private readonly INTERSTITIAL_COOLDOWN = 120000; // 2 minutes in ms
  private interstitialLoaded = false;
  private taskCompletionCounter = 0;

  // ============ INITIALIZATION ============

  async initialize(): Promise<void> {
    try {
      await AdMob.initialize({
        requestTrackingAuthorization: true,
        initializeForTesting: IS_DEVELOPMENT,
      });

      this.initialized = true;
      console.log('✅ AdMob initialized successfully');

      // Pre-load first interstitial
      await this.preloadInterstitial();
    } catch (error) {
      console.error('❌ AdMob initialization failed:', error);
      this.initialized = false;
    }
  }

  // ============ BANNER ADS ============

  async showBanner(): Promise<void> {
    if (!this.initialized) {
      console.warn('AdMob not initialized');
      return;
    }

    if (this.bannerVisible) {
      console.log('Banner already visible');
      return;
    }

    try {
      const options: BannerAdOptions = {
        adId: IS_DEVELOPMENT ? AD_CONFIG.testBannerUnitId : AD_CONFIG.bannerUnitId,
        adSize: BannerAdSize.ADAPTIVE_BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
        isTesting: IS_DEVELOPMENT,
      };

      await AdMob.showBanner(options);
      this.bannerVisible = true;
      console.log('📱 Banner ad displayed');
    } catch (error) {
      console.error('Failed to show banner:', error);
      this.bannerVisible = false;
    }
  }

  async hideBanner(): Promise<void> {
    if (!this.bannerVisible) {
      return;
    }

    try {
      await AdMob.hideBanner();
      this.bannerVisible = false;
      console.log('🚫 Banner ad hidden');
    } catch (error) {
      console.error('Failed to hide banner:', error);
    }
  }

  async removeBanner(): Promise<void> {
    try {
      await AdMob.removeBanner();
      this.bannerVisible = false;
      console.log('🗑️  Banner ad removed');
    } catch (error) {
      console.error('Failed to remove banner:', error);
    }
  }

  // ============ INTERSTITIAL ADS ============

  private async preloadInterstitial(): Promise<void> {
    if (!this.initialized) return;

    try {
      const options = {
        adId: IS_DEVELOPMENT ? AD_CONFIG.testInterstitialUnitId : AD_CONFIG.interstitialUnitId,
        isTesting: IS_DEVELOPMENT,
      };

      await AdMob.prepareInterstitial(options);
      this.interstitialLoaded = true;
      console.log('📦 Interstitial ad preloaded');
    } catch (error) {
      console.error('Failed to preload interstitial:', error);
      this.interstitialLoaded = false;
    }
  }

  /**
   * Shows interstitial ad if cooldown has passed
   * Returns true if ad was shown, false otherwise
   */
  async showInterstitial(): Promise<boolean> {
    if (!this.initialized || !this.interstitialLoaded) {
      console.log('Interstitial not ready');
      return false;
    }

    // Check cooldown
    const now = Date.now();
    const timeSinceLastAd = now - this.lastInterstitialTime;

    if (timeSinceLastAd < this.INTERSTITIAL_COOLDOWN) {
      const remainingTime = Math.ceil((this.INTERSTITIAL_COOLDOWN - timeSinceLastAd) / 1000);
      console.log(`⏳ Interstitial cooldown: ${remainingTime}s remaining`);
      return false;
    }

    try {
      await AdMob.showInterstitial();
      this.lastInterstitialTime = now;
      this.interstitialLoaded = false;
      console.log('📺 Interstitial ad shown');

      // Preload next interstitial
      setTimeout(() => this.preloadInterstitial(), 1000);

      return true;
    } catch (error) {
      console.error('Failed to show interstitial:', error);
      this.interstitialLoaded = false;
      
      // Try to reload
      setTimeout(() => this.preloadInterstitial(), 3000);
      return false;
    }
  }

  // ============ SAFE INTERSTITIAL TRIGGERS ============

  /**
   * Call this when user completes a task
   * Shows interstitial after 3-5 completions
   */
  onTaskCompleted(): void {
    this.taskCompletionCounter++;

    // Show ad after 3-5 task completions
    if (this.taskCompletionCounter >= 3 && this.taskCompletionCounter <= 5) {
      const shouldShow = Math.random() > 0.5; // 50% chance
      if (shouldShow) {
        this.showInterstitial();
        this.taskCompletionCounter = 0; // Reset counter
      }
    }

    // Reset counter after 5
    if (this.taskCompletionCounter > 5) {
      this.taskCompletionCounter = 0;
    }
  }

  /**
   * Call this when user creates a task
   */
  onTaskCreated(): void {
    // Small chance to show ad after creating task
    const shouldShow = Math.random() > 0.7; // 30% chance
    if (shouldShow) {
      // Add small delay so user sees their task first
      setTimeout(() => this.showInterstitial(), 1000);
    }
  }

  // ============ CONSENT & GDPR (Optional - Add later) ============

  /**
   * Request consent for personalized ads (GDPR compliance)
   * Call this on first app launch
   */
  async requestConsent(): Promise<void> {
    // TODO: Implement UMP (User Messaging Platform) for GDPR
    // For now, just log
    console.log('📋 Consent management not yet implemented');
  }

  // ============ UTILITY ============

  getBannerVisibility(): boolean {
    return this.bannerVisible;
  }

  getInterstitialCooldownRemaining(): number {
    const now = Date.now();
    const elapsed = now - this.lastInterstitialTime;
    const remaining = this.INTERSTITIAL_COOLDOWN - elapsed;
    return Math.max(0, remaining);
  }

  resetTaskCompletionCounter(): void {
    this.taskCompletionCounter = 0;
  }
}

// Singleton instance
export const AdMobService = new AdMobServiceClass();
