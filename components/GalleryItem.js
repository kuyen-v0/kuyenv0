import Badge from "./Badge";

export default function GalleryItem({nft}) {
  const nftNum = nft.name.split('#')[1];
  return (
    <>
      <div className="shadow-2xl relative hover:scale-105 duration-300">
        <img className="object-cover aspect-square rounded-md object-top" alt={nft.tokenId} src={nft.image}  />
        <div className="absolute w-full py-2 px-2 top-0 inset-x-0 text-white text-xs text-right leading-4">
          <Badge content={'#' + nftNum} />
        </div>
      </div>
      <div className="flex-col align-items-center">
        <p className="text-center"><b>#{nftNum}</b></p>
        <p className="text-center">Ξ {nft.price}</p>
      </div>
    </>
  );
}