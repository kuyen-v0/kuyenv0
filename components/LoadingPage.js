import Head from "next/head";

export default function LoadingPage() {
  return (
    <>
      <div className="flex items-center justify-center">
        <span className="font-bold">Loading...</span>
        <br />
        <div
          className="spinner-border inline-block h-12 w-12 animate-spin rounded-full border-4"
          role="status"
        ></div>
      </div>
    </>
  );
}
