import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not Found",
};

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-132px)] relative">
      <h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-3xl md:text-7xl p-8 leading-tight">
        404 抱歉你輸入的頁面無法被找到
      </h2>
    </div>
  );
}
