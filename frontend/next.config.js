module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://etudiant-service:8081/api/:path*',
      },
    ];
  },
};