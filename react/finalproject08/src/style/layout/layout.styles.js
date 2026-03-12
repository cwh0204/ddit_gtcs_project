import { cva } from "class-variance-authority";

//src/style/layout/layout.styles.js

// [Layout Structure Definition]

// 1. Header - Primary Color (#0f4c81)
const headerStyle = cva(/*tw*/ "h-16 bg-[#123150] text-white flex items-center justify-between px-6 z-20 shrink-0 shadow-md");

// 2. Aside - Secondary Color (#0a2742 Deep Navy) 적용
const asideStyle = cva(/*tw*/ "w-60 bg-secondary text-gray-300 flex flex-col shrink-0 transition-all duration-200 ease-in-out");

// 3. Main  - Base Color (#f4f6f8)
const mainStyle = cva(/*tw*/ "flex-1 bg-bg-base p-8 overflow-y-auto relative");

// 4. Content Wrapper
const bodyWrapperStyle = cva(/*tw*/ "flex flex-1 h-[1024px] overflow-hidden");

export const layoutStyles = {
  header: headerStyle,
  aside: asideStyle,
  main: mainStyle,
  bodyWrapper: bodyWrapperStyle,
};
