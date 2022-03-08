import Head from "next/head";

export default function LoadingPage() {
  return (
    <>
      <div class="flex items-center justify-center">
        <span>Loading...</span>
        <div
          class="spinner-border inline-block h-12 w-12 animate-spin rounded-full border-4"
          role="status"
        ></div>
      </div>
    </>
  );
}
