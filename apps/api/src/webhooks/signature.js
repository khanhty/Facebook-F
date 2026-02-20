const crypto = require('crypto');

function verifyMetaSignature({ appSecret, rawBody, headerSignature }) {
  const expected = 'sha256=' + crypto.createHmac('sha256', appSecret).update(rawBody).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(headerSignature || ''));
}

module.exports = { verifyMetaSignature };
