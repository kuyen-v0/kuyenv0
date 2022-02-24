import Badge from "./Badge";

export default function GalleryItem({nft}) {
  const nftNum = nft.name.split('#')[1];
  console.log(nft);
  return (
    <>
      <div className="relative border border-gray-200 rounded-md hover:border-black">
        <img className="object-cover w-full h-full rounded-md hover:scale-130" alt={nft.tokenId} src={nft.image}  />
        <div className="absolute w-full py-2 px-2 top-0 inset-x-0 text-white text-xs text-right leading-4">
          <Badge content={'#' + nftNum} />
        </div>
      </div>
      <div className="flex justify-between px-2">
        <p><b>{nft.name}</b></p>
        <p>Ξ {nft.price}</p>
      </div>

      {/* <div className="border border-gray-200 hover:border-black">
        <img className="relative background-image" src={nft.image} />
        <div className="absolute">
          text
        </div>
      </div>
      <div>
        <p className="mt-0.5">{nft.name}</p>
      </div> */}
    </>
  );
}