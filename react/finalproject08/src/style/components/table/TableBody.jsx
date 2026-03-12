import { cn } from "../../utils";

//src/style/components/table/TableBody.jsx
function TableBody({ className, children, ...props }) {
  return (
    <>
      <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props}>
        {children}
      </tbody>
    </>
  );
}

export default TableBody;

/* 
  tailwindcss에서 혹은 css에서 클래스(=class)라는 말은 "스타일 묶음이다."
  "현재 클래스가 붙은 요소" 라는 말의 의미는 지금 이 tailwind 클래스들(스타일 묶음을)을 가지고 있는 HTML 요소 
  ex) <div className="w-full rounded-lg border">
      -> 여기서 div가 스타일 묶음이 붙은 HTML 요소이다.

  age-grid를 코스튬하는 과정에서 보이는 "&"부호는 이 HTML 요소를 가리킨다.
  &_의 의미는이 스타일 묶음을 가지고 있는 요소의
*/
