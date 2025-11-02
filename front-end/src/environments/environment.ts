/**
 * Development environment configuration
 */
export const environment = {
  production: false,
  apiUrl: 'http://localhost:9999',
  keycloak: {
    url: 'http://localhost:8080',
    realm: 'starter-app',
    clientId: 'starter-client',
  },
};
