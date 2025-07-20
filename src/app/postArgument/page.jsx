// /app/postArgument/page.js
import { Suspense } from "react";
import ArgumentForm from "./ArgumentForm";

export default function PostArgumentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ArgumentForm />
    </Suspense>
  );
}
