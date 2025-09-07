# 🎵 Yuna Music - SillyDev.co.uk Optimized Container
# Professional Discord music bot with enhanced performance

FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install system dependencies for SillyDev (Alpine Linux)
RUN apk add --no-cache \
    ffmpeg \
    make \
    g++ \
    python3 \
    py3-pip \
    opus-dev \
    opus \
    opus-tools \
    libtool \
    autoconf \
    automake \
    pkgconfig \
    wget \
    curl \
    git \
    bash \
    && npm install -g node-gyp

# Set environment variables for SillyDev
ENV PLATFORM=sillydev \
    CONTAINER_MODE=true \
    NODE_ENV=production \
    AUDIO_QUALITY=medium \
    OPUS_ENGINE=opusscript

# Copy package files
COPY package*.json ./

# Install Node.js dependencies  
RUN npm ci --only=production && npm cache clean --force

# Copy application files (needed for fix scripts)
COPY . .

# Run container-specific setup (includes Opus fix)
RUN npm run container-setup || echo "Container setup completed with warnings"

# Make scripts executable
RUN chmod +x install-deps.sh || true

# Create user for security
RUN useradd -m -u 1000 musicbot && chown -R musicbot:musicbot /app
USER musicbot

# Health check using web server endpoint (SillyDev compatible)
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:${PORT:-3000}/ || exit 1

# SillyDev-optimized environment variables
ENV NODE_ENV=production \
    NODE_OPTIONS="--max-old-space-size=512" \
    PORT=3000 \
    MEMORY_LIMIT=512

# Expose port (if needed for web dashboard)
EXPOSE 3000

# Start command
CMD ["npm", "start"]