export default function BigButton({ bg, text, textColor }) {
  return (
    <button className={`${bg ?? 'bg-black'} py-4 px-12 text-2xl font-bold ${textColor ?? 'text-white'} duration-200 hover:scale-110`}>
      {text}
    </button>
  );
}