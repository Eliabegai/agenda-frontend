import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import * as tailwindcss from 'eslint-plugin-tailwindcss'; // Importando o plugin corretamente
import prettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    plugins: {
      tailwindcss,
      prettier,
    },
    rules: {
      ...eslintConfigPrettier.rules,
      'prettier/prettier': 'error', // Faz ESLint exibir erro se o código não estiver formatado corretamente
      'tailwindcss/no-custom-classname': 'off', // Permite classes personalizadas
      'tailwindcss/classnames-order': 'warn', // Sugere uma ordem padrão para classes Tailwind
      'tailwindcss/no-contradicting-classname': 'error', // Impede classes conflitantes (ex: 'p-4 p-6')
      'max-len': ['error', { code: 80, ignoreUrls: true }], // Limite de 80 caracteres por linha
      'newline-per-chained-call': ['error', { ignoreChainWithDepth: 2 }], // Quebra linhas em chamadas encadeadas longas
      'object-curly-newline': ['error', { multiline: true }], // Quebra de linha em objetos grandes
      'array-bracket-newline': ['error', 'consistent'], // Força quebras de linha em arrays grandes
    },
  },
];

export default eslintConfig;
