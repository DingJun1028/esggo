const requireOmniHeart5t = require('./rules/require-omni-heart-5t').rules['require-omni-heart-5t'];

module.exports = {
  rules: {
    'require-omni-heart-5t': requireOmniHeart5t,
  },
  configs: {
    recommended: {
      plugins: ['junaikey'],
      rules: {
        'junaikey/require-omni-heart-5t': 'error',
      },
    },
  },
};
