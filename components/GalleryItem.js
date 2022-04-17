import Badge from "./Badge";

export default function GalleryItem({ nft }) {
  console.log(nft.metadata);
  console.log(nft);
  const nftNum = nft.metadata.name.split("#")[1];
  return (
    <>
      <div className="relative shadow-xl duration-300 hover:scale-105">
        <img
          className="aspect-square rounded-md object-cover object-top"
          alt={nft.id}
          src={nft.image}
        />
        <div className="absolute inset-x-0 top-0 w-full py-2 px-2 text-right text-xs leading-4 text-white">
          <Badge content={"#" + nftNum} />
        </div>
      </div>
      <div className="align-items-center flex-col">
        <p className="text-center text-white">
          {nft.name} #{nftNum}
        </p>
        {/* <p className="text-center text-white">Ξ {nft.price}</p> */}
      </div>
    </>
  );
}
