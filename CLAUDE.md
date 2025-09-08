# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a medical assistant application built with UniApp, designed to provide AI-powered medical consultation and image diagnosis services. The app features:

1. AI intelligent diagnosis through chat interface
2. MRI image analysis for knee osteoarthritis staging
3. User account management
4. Medical record keeping
5. Health data tracking

## Codebase Structure

- `pages/` - Main application pages
  - `index/` - Home page with dashboard
  - `ai-doctor/` - AI chat interface for medical consultation
  - `image-diagnose/` - MRI image upload and analysis
  - `mine/` - User center with login, profile, and settings
- `utils/` - Utility functions including AI service integration
- `config/` - Configuration files for AI models
- `static/` - Static assets like images and icons
- `docs/` - Documentation files

## Key Components

### AI Service Integration
The application supports multiple AI model integration approaches:
- OpenAI-compatible APIs (ChatGLM, Qwen, etc.)
- Custom API formats
- WebSocket connections
- Local model deployment

AI configuration is managed in `config/ai-config.js` where you can switch between different model providers.

### Medical Features
1. **AI Doctor Chat**: Real-time medical consultation with conversation history
2. **Image Diagnosis**: Knee MRI analysis for osteoarthritis staging (I-IV)
3. **Health Records**: User medical history management
4. **Health Tracking**: Step count, sleep, heart rate, and blood pressure monitoring

## Development Commands

Since this is a UniApp project, development is typically done through HBuilderX IDE. Common operations include:

1. Preview in browser: Use HBuilderX's built-in preview feature
2. Compile for different platforms: Use HBuilderX's release function
3. Debug on device: Use HBuilderX's mobile debugging tools

For manual operations:
```bash
# The project is built with UniApp/HBuilderX rather than standard npm scripts
# Build and development is typically handled through the IDE
```

## Architecture Notes

1. **UI Framework**: Uses UniApp's Vue-based framework for cross-platform development
2. **State Management**: Simple component-based state, no Vuex/pinia
3. **Data Flow**: Direct API calls with local storage for persistence
4. **Styling**: Uses rpx units for responsive design across platforms
5. **Navigation**: Tab-based navigation with stack-based page navigation

## AI Integration

The project includes a flexible AI service layer (`utils/ai-service.js`) that supports:
- Multiple API formats
- Retry mechanisms
- Conversation history management
- Configurable model parameters

To integrate with your own AI model:
1. Update `config/ai-config.js` with your API details
2. Set `CURRENT_CONFIG` to your chosen integration method
3. Test the connection through the AI doctor interface

See `docs/AI_MODEL_INTEGRATION.md` for detailed integration instructions.