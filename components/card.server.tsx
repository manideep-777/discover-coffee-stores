import Link from "next/link";
import Image from "next/image";

type CardType = {
  name: string;
  imgUrl: string;
  href: string;
}

const Card = ({name, imgUrl, href}: CardType) => {
  return (
    <Link href={href} className="m-auto rounded-xl border-gray-400 shadow-2xl">
      <div
        className={`glass min-h-[200px] rounded-xl px-5 pb-5 pt-1 backdrop-blur-3xl`}
      >
        <div className="my-3">
          <h2 className="w-64 text-ellipsis whitespace-nowrap text-xl font-bold">
            {name}
          </h2>
        </div>
        <div className="relative w-full h-48">
          <Image
            className="rounded-lg shadow-lg"
            src={imgUrl}
            fill
            style={{ objectFit: "cover" }}
            alt="Coffee Store Image"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO8/+ZNPQAIoQM4xp5zkgAAAABJRU5ErkJggg=="
            placeholder="blur"
          />
        </div>
      </div>
    </Link>
  )
}

export default Card
