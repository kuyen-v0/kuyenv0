import Navbar from "./Navbar";

export default function PageTemplate({ page, navProps }) {
  return (
    <>
    <Navbar {...navProps} />
    {page}
    </>
  );
}