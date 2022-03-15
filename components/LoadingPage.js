export default function LoadingPage() {
  return (
    <>
      <center>
        <span className="text-4xl font-bold">Loading...</span>
      </center>
      <br />
      <div className="flex items-center justify-center">
        <br />
        <div
          className="spinner-border inline-block h-12 w-12 animate-spin rounded-full border-4"
          role="status"
        ></div>
      </div>
      <br />
      <center>
        <img src="https://mir-s3-cdn-cf.behance.net/project_modules/disp/04de2e31234507.564a1d23645bf.gif" />
      </center>
    </>
  );
}
