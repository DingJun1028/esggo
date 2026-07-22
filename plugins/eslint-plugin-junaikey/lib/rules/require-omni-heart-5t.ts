// ============================================================================
// [O-Ring 聖典協議] ESLint Custom Plugin - v3.1
// Enforces the omnipresent declaration of 5T properties on specific structures.
// ============================================================================

module.exports = {
  rules: {
    'require-omni-heart-5t': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Enforce the complete declaration of 5T properties (Truthful, Transferful, Thankful, Tasteful, Trustful) inside omni interfaces or specific structures.',
          category: 'JunAiKey Architecture',
          recommended: true,
        },
        fixable: null, 
        schema: [], 
        messages: {
          missingProperty: 'The 5T protocol strictly requires the "{{ missingProp }}" property to be declared (4可1不可).',
        },
      },
      create(context: any) {
        const requiredProperties = ['truthful', 'transferful', 'thankful', 'tasteful', 'trustful'];

        return {
          // Check Object Expressions assigned to OmniHeart typed variables or properties named `_omniHeart`/`principles_5T`
          ObjectExpression(node: any) {
            const isOmniHeartStructure = 
                 (node.parent.type === 'Property' && (node.parent.key.name === '_omniHeart' || node.parent.key.name === 'principles_5T' || node.parent.key.name === 'protocol_5T' || node.parent.key.name === 'score_5t')) ||
                 (node.parent.type === 'VariableDeclarator' && node.parent.id.typeAnnotation?.typeAnnotation?.typeName?.name === 'OmniHeart');
                 
            if (!isOmniHeartStructure) return;

            const definedProperties = node.properties
              .filter((p: any) => p.type === 'Property' && p.key.type === 'Identifier')
              .map((p: any) => p.key.name);

            requiredProperties.forEach((prop) => {
              if (!definedProperties.includes(prop)) {
                context.report({
                  node,
                  messageId: 'missingProperty',
                  data: {
                    missingProp: prop,
                  },
                });
              }
            });
          },

          // Check TS Interfaces that extend OmniHeart
          TSInterfaceDeclaration(node: any) {
            const extendOmni = node.extends?.some((ext: any) => ext.expression.name === 'OmniHeart');
            if (!extendOmni) return;

            const definedProperties = node.body.body
              .filter((member: any) => member.type === 'TSPropertySignature' && member.key.type === 'Identifier')
              .map((member: any) => member.key.name);

             requiredProperties.forEach((prop) => {
              if (!definedProperties.includes(prop)) {
                context.report({
                  node,
                  messageId: 'missingProperty',
                  data: {
                    missingProp: prop,
                  },
                });
              }
             });
          }
        };
      },
    },
  },
};
