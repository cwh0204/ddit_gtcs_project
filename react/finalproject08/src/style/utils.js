import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

//src/style/utils.js
/**
 * ClassName Merge Utility
 * clsx로 조건부 클래스를 결합하고, twMerge로 Tailwind 충돌을 해결합니다.
 * * 사용 예시:
 * cn("bg-blue-500", isError && "bg-red-500", className)
 * -> isError가 true면 bg-red-500이 bg-blue-500을 덮어씁니다.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
