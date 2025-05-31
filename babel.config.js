module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // NOTE: No plugins array needed for SDK 50+ as expo-router/babel is now deprecated
  };
};
