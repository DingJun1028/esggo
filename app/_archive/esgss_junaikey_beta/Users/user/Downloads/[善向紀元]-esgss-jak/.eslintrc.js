module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended'
  ],
  ignorePatterns: [
    'dist',
    'node_modules',
    'coverage',
    'build',
    '*.config.js',
    '*.config.ts',
    'server/**/*.js',
    'scripts/**/*.js',
    'celestial-system/**/*.js',
    'junaikeydb-server/**/*.js',
    'shan-xiang-tech/**/*.js'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: [
    'react-refresh',
    'react',
    'react-hooks',
    'prettier'
  ],
  settings: {
    react: {
      version: 'detect'
    }
  },
  overrides: [
    // 包含TypeScript語法的文件（無論擴展名）
    {
      files: [
        '**/*.ts', '**/*.tsx',
        'services/**/*.js',
        'components/**/*.js',
        'components/**/*.jsx',
        'contexts/**/*.js',
        'hooks/**/*.js',
        'utils/**/*.js',
        'src/**/*.ts', 'src/**/*.tsx', 'src/**/*.js', 'src/**/*.jsx',
        'tests/**/*.ts', 'tests/**/*.tsx'
      ],
      extends: [
        'eslint:recommended',
        '@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended',
        'plugin:prettier/recommended'
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        },
        project: false // 禁用項目範圍檢查以避免配置問題
      },
      plugins: [
        'react-refresh',
        '@typescript-eslint',
        'react',
        'react-hooks',
        'prettier'
      ],
      env: {
        browser: true,
        es2020: true,
        node: true
      },
      rules: {
        // TypeScript 規則
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/prefer-const': 'error',
        '@typescript-eslint/no-var-requires': 'off',
        // 放寬一些規則以適應現有代碼
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-empty-function': 'off'
      }
    },
    // 純JavaScript文件
    {
      files: [
        '**/*.js', '**/*.jsx',
        'server/**/*.js',
        'celestial-system/**/*.js',
        'junaikeydb-server/**/*.js',
        'shan-xiang-tech/**/*.js'
      ],
      excludedFiles: [
        'services/**/*.js',
        'components/**/*.js',
        'components/**/*.jsx',
        'contexts/**/*.js',
        'hooks/**/*.js',
        'utils/**/*.js',
        'src/**/*.js', 'src/**/*.jsx'
      ],
      extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended',
        'plugin:prettier/recommended'
      ],
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      },
      plugins: [
        'react-refresh',
        'react',
        'react-hooks',
        'prettier'
      ],
      env: {
        browser: true,
        es2020: true,
        node: true
      }
    },
    // 測試文件配置
    {
      files: ['**/*.test.*', '**/*.spec.*', 'src/test/**/*'],
      extends: [
        'eslint:recommended',
        '@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended',
        'plugin:prettier/recommended'
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      },
      plugins: [
        'react-refresh',
        '@typescript-eslint',
        'react',
        'react-hooks',
        'prettier'
      ],
      env: {
        browser: true,
        es2020: true,
        node: true,
        'jest': true,
        'vitest-globals/env': true
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'no-console': 'off',
        'no-undef': 'off' // 測試框架全局變數
      }
    },
    // 配置文件
    {
      files: ['*.config.js', '*.config.ts', 'vite.config.ts'],
      extends: [
        'eslint:recommended',
        'plugin:prettier/recommended'
      ],
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      rules: {
        'no-console': 'off',
        '@typescript-eslint/no-var-requires': 'off'
      }
    }
  ],
  rules: {
    // TypeScript 規則
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/prefer-const': 'error',
    '@typescript-eslint/no-var-requires': 'off',

    // React 規則
    'react/prop-types': 'off', // 使用 TypeScript 進行類型檢查
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-key': ['error', { checkFragmentShorthand: true }],
    'react/jsx-no-useless-fragment': 'error',
    'react/self-closing-comp': 'error',

    // React Hooks 規則
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // 一般規則
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    'no-debugger': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-template': 'error',

    // Prettier 整合
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'es5',
        tabWidth: 2,
        semi: true,
        printWidth: 100,
        bracketSpacing: true,
        arrowParens: 'avoid'
      }
    ],

    // 自訂規則
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['../**'],
            message: '相對引入路徑應避免使用多個 "../"'
          }
        ]
      }
    ],

    // 效能相關規則
    'react/jsx-no-bind': [
      'error',
      {
        ignoreRefs: true,
        allowArrowFunctions: true,
        allowFunctions: false,
        allowBind: false
      }
    ],

    // 代碼品質規則
    'no-magic-numbers': [
      'warn',
      {
        ignore: [0, 1, -1, 2],
        ignoreArrayIndexes: true,
        ignoreDefaultValues: true,
        ignoreClassFieldInitializers: true
      }
    ]
  },
  overrides: [
    {
      files: ['*.test.ts', '*.test.tsx', '*.spec.ts', '*.spec.tsx'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'no-console': 'off',
        'no-magic-numbers': 'off'
      }
    },
    {
      files: ['*.config.js', '*.config.ts', 'vite.config.ts'],
      rules: {
        'no-console': 'off',
        '@typescript-eslint/no-var-requires': 'off'
      }
    }
  ]
};