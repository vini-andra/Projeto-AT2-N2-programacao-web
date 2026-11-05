//o jwks-rsa depende do jose, que só existe como ESM e o jest não consegue carregar
module.exports = () => ({
    getSigningKey: (kid, callback) => callback(new Error('sem acesso ao Google nos testes'))
});
