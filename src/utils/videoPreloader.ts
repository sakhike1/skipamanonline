// Video preloading utility for better performance

interface VideoPreloadOptions {
  preload?: 'none' | 'metadata' | 'auto';
  priority?: 'high' | 'low';
  quality?: 'low' | 'medium' | 'high';
}

class VideoPreloader {
  private preloadedVideos = new Map<string, HTMLVideoElement>();
  private loadingQueue: Array<{ src: string; options: VideoPreloadOptions }> = [];
  private isProcessing = false;

  // Preload a video with specified options
  async preloadVideo(src: string, options: VideoPreloadOptions = {}): Promise<void> {
    const {
      preload = 'metadata',
      priority = 'low',
      quality = 'medium'
    } = options;

    // If already preloaded, return immediately
    if (this.preloadedVideos.has(src)) {
      return;
    }

    // Add to queue based on priority
    const queueItem = { src, options };
    if (priority === 'high') {
      this.loadingQueue.unshift(queueItem);
    } else {
      this.loadingQueue.push(queueItem);
    }

    // Start processing if not already running
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  // Process the loading queue
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.loadingQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.loadingQueue.length > 0) {
      const { src, options } = this.loadingQueue.shift()!;
      
      try {
        await this.loadVideo(src, options);
      } catch (error) {
        console.warn(`Failed to preload video: ${src}`, error);
      }
    }

    this.isProcessing = false;
  }

  // Load a single video
  private async loadVideo(src: string, options: VideoPreloadOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      
      // Set video attributes for optimal loading
      video.preload = options.preload || 'metadata';
      video.muted = true;
      video.playsInline = true;
      video.style.display = 'none';
      
      // Add to DOM temporarily for loading
      document.body.appendChild(video);

      // Event handlers
      const handleCanPlay = () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
        
        // Store the preloaded video
        this.preloadedVideos.set(src, video);
        
        // Remove from DOM
        document.body.removeChild(video);
        
        resolve();
      };

      const handleError = (error: Event) => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
        
        // Remove from DOM
        if (document.body.contains(video)) {
          document.body.removeChild(video);
        }
        
        reject(error);
      };

      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', handleError);

      // Set source and start loading
      video.src = src;
      video.load();
    });
  }

  // Get a preloaded video
  getPreloadedVideo(src: string): HTMLVideoElement | null {
    return this.preloadedVideos.get(src) || null;
  }

  // Check if a video is preloaded
  isPreloaded(src: string): boolean {
    return this.preloadedVideos.has(src);
  }

  // Clear preloaded videos to free memory
  clearPreloadedVideos(): void {
    this.preloadedVideos.forEach(video => {
      video.src = '';
      video.load();
    });
    this.preloadedVideos.clear();
  }

  // Preload multiple videos
  async preloadMultiple(videos: Array<{ src: string; options?: VideoPreloadOptions }>): Promise<void> {
    const promises = videos.map(({ src, options }) => 
      this.preloadVideo(src, options)
    );
    
    await Promise.allSettled(promises);
  }

  // Get loading status
  getLoadingStatus(): { preloaded: number; queued: number; processing: boolean } {
    return {
      preloaded: this.preloadedVideos.size,
      queued: this.loadingQueue.length,
      processing: this.isProcessing
    };
  }
}

// Create singleton instance
export const videoPreloader = new VideoPreloader();

// Utility functions for common video operations
export const videoUtils = {
  // Optimize video source based on device capabilities
  getOptimizedVideoSrc: (originalSrc: string, quality: 'low' | 'medium' | 'high' = 'medium'): string => {
    // Add quality parameters to video URL if supported
    const url = new URL(originalSrc, window.location.origin);
    
    switch (quality) {
      case 'low':
        url.searchParams.set('quality', 'low');
        break;
      case 'high':
        url.searchParams.set('quality', 'high');
        break;
      default:
        url.searchParams.set('quality', 'medium');
    }
    
    return url.toString();
  },

  // Check if video format is supported
  isVideoFormatSupported: (format: string): boolean => {
    const video = document.createElement('video');
    return video.canPlayType(`video/${format}`) !== '';
  },

  // Get recommended video format based on browser support
  getRecommendedFormat: (): string => {
    const formats = ['mp4', 'webm', 'ogg'];
    
    for (const format of formats) {
      if (videoUtils.isVideoFormatSupported(format)) {
        return format;
      }
    }
    
    return 'mp4'; // Fallback
  },

  // Create video thumbnail from video element
  createThumbnail: async (video: HTMLVideoElement, time: number = 0): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      video.currentTime = time;
      
      video.addEventListener('seeked', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        
        try {
          const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
          resolve(thumbnail);
        } catch (error) {
          reject(error);
        }
      }, { once: true });
      
      video.addEventListener('error', () => {
        reject(new Error('Failed to seek video'));
      }, { once: true });
    });
  }
};

export default videoPreloader; 