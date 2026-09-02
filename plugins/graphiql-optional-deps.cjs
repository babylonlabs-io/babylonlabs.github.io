/**
 * GraphiQL reaches subscription support through `@graphiql/toolkit`, which
 * imports `graphql-ws`. That import is a declared **optional** peer dependency
 * (`peerDependenciesMeta.graphql-ws.optional === true`), and the vault indexer
 * endpoint serves no subscriptions, so the package is deliberately not
 * installed.
 *
 * Without this, webpack emits a "Can't resolve 'graphql-ws'" warning on every
 * build. Marking it resolvable-as-false tells webpack the absence is intended,
 * rather than adding a runtime dependency the site never uses.
 */
module.exports = function graphiqlOptionalDeps() {
  return {
    name: 'graphiql-optional-deps',
    configureWebpack() {
      return {
        resolve: {
          fallback: {
            'graphql-ws': false,
          },
        },
      };
    },
  };
};
