import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignoreDuringBuilds: true,
    rules: {
      "@typescript-eslint/no-unused-vars": "off", // 사용하지 않는 변수 경고 완전 비활성화
      "@typescript-eslint/no-explicit-any": "off", // any 타입 사용 경고 비활성화
    },
  },
];

export default eslintConfig;
